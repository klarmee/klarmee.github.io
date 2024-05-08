const y = function(){return document.body.offsetHeight - document.body.clientHeight}
const i = function(){return Math.min(Math.round(window.scrollY * imgs.length / y()), imgs.length - 1)}
const imgs = Array.from(document.querySelectorAll('img'))
const img = function(){return imgs[i()]}

imgs.forEach((img, i) => {
    img.onclick = (e) => {
        e.preventDefault()
        wrapper.hidden = false
        scrollTo(0, Math.max(y() * i / imgs.length, 1))
    }
})

window.onscroll = onscrub

function onscrub() {
    if (img().complete) {
        requestAnimationFrame(() => {
            scrubber.width = img().naturalWidth
            scrubber.height = img().naturalHeight
            scrubber.getContext("2d").drawImage(img(), 0, 0, img().naturalWidth, img().naturalHeight)
            scrubber.onclick = function(){window.open(img().parentElement.href)}
            window.ontouchmove = onzoom
            window.onwheel = onzoom
        })
    }
}

function onzoom(e) {
    if (window.visualViewport.scale > 1 || (e.touches !== undefined && e.touches.length > 1)) {
        let hiRes
        hiRes = new Image()
        hiRes.src = img().src.replace('/800/', '/o/')
        hiRes.onload = function () {
            if (scrubber.width < document.body.clientWidth) scrubber.style.height = scrubber.height
            if (scrubber.height < document.body.clientHeight) scrubber.style.width = scrubber.width
            scrubber.width = hiRes.naturalWidth
            scrubber.height = hiRes.naturalHeight
            scrubber.getContext("2d").drawImage(hiRes, 0, 0, hiRes.naturalWidth, hiRes.naturalHeight)
        }
        window.onscroll = null
        window.ontouchmove = onzoomreset
        window.onwheel = onzoomreset
    }
}

function onzoomreset() {
    if (window.visualViewport.scale === 1) {
        scrubber.width = img().naturalWidth
        scrubber.height = img().naturalHeight
        scrubber.style.height = ''
        scrubber.style.width = ''
        scrubber.getContext("2d").drawImage(img(), 0, 0, img().naturalWidth, img().naturalHeight)
        window.onscroll = onscrub
        window.ontouchmove = null
        window.onwheel = null
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowRight') scrollBy(0, y() / imgs.length)
    else if (e.key == 'ArrowLeft') scrollBy(0, -y() / imgs.length)
    else if (e.key == 'Escape') toggleScrubbing()
})

wrapper.onclick = (e) => {
    if (e.target !== scrubber && e.target.tagName !== 'IMG') wrapper.hidden = true
}

function toggleScrubbing() {
    wrapper.hidden = wrapper.hidden == true ? false : true
}
