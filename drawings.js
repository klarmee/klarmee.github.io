function imgs() {return Array.from(document.querySelectorAll('img'))}
function img() { return imgs()[i()] }
function i() { return Math.round(((window.scrollY + window.innerHeight * scrollPercent()) * imgs().length / y()) - .25) }
function y() { return document.body.offsetHeight }
function scrollPercent(){ return Math.min(Math.max(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 0), 1) }

window.addEventListener('click', (e) => {
    if (e.target.tagName !== 'A') toggleCanvas()
})
window.onscroll = drawframe

imgs().forEach((img, index) => {
    img.onclick = function(e) {
        e.preventDefault()
        console.log('clicked: ' + index)
        if (canvaswrapper.style.display == 'none') scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * index / imgs().length)
    }  
})

window.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowRight') scrollBy(0, y() / imgs().length)
    else if (e.key == 'ArrowLeft') scrollBy(0, -y() / imgs().length)
    else if (e.key == 'Escape') toggleCanvas()
})

function drawframe() {
    if (typeof(img()) !== 'undefined' && img().complete) {
        canvaswrapper.style.display == ''
        requestAnimationFrame(() => {
            canvas.width = img().naturalWidth
            canvas.height = img().naturalHeight
            canvas.getContext("2d").drawImage(img(), 0, 0, img().naturalWidth, img().naturalHeight)
            window.ontouchmove = window.onwheel = onzoom
        })
    }
}

function onzoom(e) {
    if (window.visualViewport.scale > 1 | (e.touches !== undefined && e.touches.length > 1)) {
        let hiRes
        hiRes = new Image()
        hiRes.src = img().src.replace('/800/', '/o/')
        hiRes.onload = function () {
            if (canvas.width < document.body.clientWidth) canvas.style.height = canvas.height
            if (canvas.height < document.body.clientHeight) canvas.style.width = canvas.width
            canvas.width = hiRes.naturalWidth
            canvas.height = hiRes.naturalHeight
            canvas.getContext("2d").drawImage(hiRes, 0, 0, hiRes.naturalWidth, hiRes.naturalHeight)
        }
        window.onscroll = window.ontouchmove = null
        window.ontouchend = window.onwheel = onzoomreset
    }
}

function onzoomreset() {
    if (window.visualViewport.scale === 1) {
        canvas.width = img().naturalWidth
        canvas.height = img().naturalHeight
        canvas.style.height = ''
        canvas.style.width = ''
        canvas.getContext("2d").drawImage(img(), 0, 0, img().naturalWidth, img().naturalHeight)
        window.ontouchend = null
        window.onscroll = drawframe
        window.ontouchmove = window.onwheel = onzoom
    }
}

function toggleCanvas() {canvaswrapper.style.display = canvaswrapper.style.display == 'none' ? '' : 'none'}
