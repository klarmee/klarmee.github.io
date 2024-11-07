const imgs = Array.from(document.querySelectorAll('img'))
function y() {return document.body.offsetHeight}
function i() {return Math.round((window.scrollY * (imgs.length) / y()) - .25)}
function img() {return imgs[i()]}
function drawframe() {
    if (img().complete) {
        requestAnimationFrame(() => {
            canvas.width = img().naturalWidth
            canvas.height = img().naturalHeight
            canvas.getContext("2d").drawImage(img(), 0, 0, img().naturalWidth, img().naturalHeight)
            counter.innerHTML = i() + 1
        }) 
    }
}
function toggleCanvas() { canvas.style.display = canvas.style.display == '' ? 'none' : '' }
window.onscroll = drawframe
img().onload = drawframe
window.addEventListener('click', (e) => {
    if (e.target.tagName !== 'A') toggleCanvas()
})

if (window.matchMedia("(min-resolution: 2x)").matches) {
    const waitForLoad = img => 
      new Promise(resolve => img.onload = resolve);
    
    const setWidth = img => img.style.width = `${img.naturalWidth / 2}px`;
    
    for (const img of imgs) {
      if (img.complete && img.naturalWidth > 0) {
        setWidth(img);
      } else {
        setWidth(img)
        waitForLoad(img).then(() => setWidth(img));
      }
    }
  }