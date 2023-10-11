// build canvas
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
const canvasWrapper = document.createElement('div')
const scrubInfo = document.createElement('div')
const linkToTop = document.createElement('a')
const output = document.createElement('span')
const spacer = document.createElement('div')
canvas.onclick = () => window.location = images[i].src.replace(/\/800\//, '/o/')
linkToTop.href = "#"
linkToTop.innerText = "^"
linkToTop.onclick = () => init()
output.classList.add('output')
output.innerText = "1"
scrubInfo.classList.add('scrubinfo')
scrubInfo.append(linkToTop, output)
canvasWrapper.classList.add('canvasWrapper')
canvasWrapper.append(canvas, scrubInfo)
document.body.append(canvasWrapper)
const style = document.createElement('style')
style.innerHTML = 'img, .img{display:none;}canvas{display:initial;}'
document.head.append(style)
document.body.append(spacer)

// build array of images
const scrollStep = 20
const initialOffset = window.scrollY + scrubInfo.getBoundingClientRect().top
let i = Math.max(0, Math.ceil((window.scrollY - initialOffset) / scrollStep))
const images = []
Array.from(document.querySelectorAll('img')).forEach((img, index) => {
    const image = new Image()
    image.src = img.src.replace(/\/200\//, '/800/')
    image.index = index
    image.addEventListener("load", handleLoad)
    images.push(image)
})

function handleLoad() {
    i =  this.index
    draw()
    images.forEach(image => {
        image.removeEventListener("load", handleLoad)
    })
}

// set window height
spacer.style.height = images.length * scrollStep + document.documentElement.clientHeight + 'px'

// checkbox
if (window.innerWidth > 660) {
    const checkbox = document.createElement('input')
    checkbox.type = "checkbox"
    checkbox.checked = true
    checkbox.addEventListener('change', function () {
        const style = document.createElement('style')
        if (this.checked) {
            window.addEventListener('scroll', onScrub, { passive: true });
            style.innerHTML = 'img, .img{display:none;}canvas{display:initial;}'
            document.body.append(spacer)
        } else {
            window.removeEventListener('scroll', onScrub, { passive: true });
            style.innerHTML = 'img, .img{display:initial;}canvas{display:none;}'
            spacer.remove()
        }
        document.head.append(style)
    })
    document.querySelector('nav').insertAdjacentElement("beforeend", checkbox)
}

// scroll event
window.addEventListener('scroll', onScrub, { passive: true });
function onScrub() {
    window.addEventListener('touchmove', onZoom)
    i = Math.max(0, Math.ceil((window.scrollY - initialOffset) / scrollStep))
    draw()
}

// zoom in event
function onZoom() {
    if (window.visualViewport.scale > 1) {
        window.removeEventListener('scroll', onScrub)
        window.removeEventListener('touchmove', onZoom)
        window.addEventListener('touchmove', onReset)
        let img = new Image()
        img.src = images[i].src.replace(/\/200\//, '/800/')
        img.onload = function () {
            context.drawimage(img, 0, 0, img.naturalWidth, img.naturalHeight)
        }
    }
}

// zoom out event
function onReset() {
    if (window.visualViewport.scale === 1) {
        window.removeEventListener('touchmove', onReset)
        window.addEventListener('scroll', onScrub, { passive: true });
    }
}

function draw() {
    const img = images[i]
    if (img !== undefined) {
        output.innerHTML = i + 1
        if (img.complete) {
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
            canvas.style.top = Math.floor((window.innerHeight - canvas.getBoundingClientRect().height) / 2) + 'px'
            output.style.opacity = '1'
        } else {
            output.style.opacity = '.5'
        }
    }
}