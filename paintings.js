const imgs = Array.from(document.querySelectorAll('img'))
function y() {return document.body.offsetHeight}
function i() {return Math.round((window.scrollY * (imgs.length) / y()) - .25)}
function img() {return imgs[i()]}
function drawframe() {
    if (img().complete) {
        requestAnimationFrame(() => {
            tv.width = img().naturalWidth
            tv.height = img().naturalHeight
            tv.getContext("2d").drawImage(img(), 0, 0, img().naturalWidth, img().naturalHeight)
        }) 
    }
}
function toggleTv() {tv.style.display = tv.style.display == '' ? 'none' : ''}
window.onscroll = drawframe
img().onload = drawframe
window.onclick = toggleTv
if (window.matchMedia("(min-resolution: 1x)").matches) {imgs.forEach(i => i.style.width = '50%')}