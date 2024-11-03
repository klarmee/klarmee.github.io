// Calculate the scroll percentage (0 at the top, 1 at the bottom)
function scrollPercent(){return Math.min(Math.max(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 0), 1)}

const imgs = Array.from(document.querySelectorAll('img'))
function img() { return imgs[i()] }
function i() { return Math.round(((window.scrollY + window.innerHeight * scrollPercent()) * imgs.length / y()) - .25) }
function y() { return document.body.offsetHeight }

window.onclick = toggleTv

img().onload = drawframe
window.onscroll = drawframe

imgs.forEach((img, i) => img.onclick = function(e) {
    e.preventDefault()
    if (tv.style.display == 'none') scrollTo(0, y() * i / imgs.length)
})

window.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowRight') scrollBy(0, y() / imgs.length)
    else if (e.key == 'ArrowLeft') scrollBy(0, -y() / imgs.length)
    else if (e.key == 'Escape') toggleTv()
})

function drawframe() {
    if (img().complete) {
        tv.style.display == ''
        requestAnimationFrame(() => {
            tv.width = img().naturalWidth
            tv.height = img().naturalHeight
            tv.getContext("2d").drawImage(img(), 0, 0, img().naturalWidth, img().naturalHeight)
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
            if (tv.width < document.body.clientWidth) tv.style.height = tv.height
            if (tv.height < document.body.clientHeight) tv.style.width = tv.width
            tv.width = hiRes.naturalWidth
            tv.height = hiRes.naturalHeight
            tv.getContext("2d").drawImage(hiRes, 0, 0, hiRes.naturalWidth, hiRes.naturalHeight)
        }
        window.onscroll = window.ontouchmove = null
        window.ontouchend = window.onwheel = onzoomreset
    }
}

function onzoomreset() {
    if (window.visualViewport.scale === 1) {
        tv.width = img().naturalWidth
        tv.height = img().naturalHeight
        tv.style.height = ''
        tv.style.width = ''
        tv.getContext("2d").drawImage(img(), 0, 0, img().naturalWidth, img().naturalHeight)
        window.ontouchend = null
        window.onscroll = drawframe
        window.ontouchmove = window.onwheel = onzoom
    }
}

function toggleTv() {tv.style.display = tv.style.display == 'none' ? '' : 'none'}
