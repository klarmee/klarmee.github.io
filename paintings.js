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
            counter.innerHTML = i() + 1
        }) 
    }
}
function toggleTv() {tv.style.display = tv.style.display == '' ? 'none' : ''}
window.onscroll = drawframe
img().onload = drawframe
window.onclick = toggleTv
if (window.matchMedia("(min-resolution: 2x)").matches) {imgs.forEach(img => {
    intervalId = setInterval(() => {
        if (img.naturalWidth > 0) {
            img.style.width = `${img.naturalWidth / 2}px`   
            clearInterval(intervalId) 
        }
    }, 10)
    })}
