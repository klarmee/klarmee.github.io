const canvas150 = document.querySelector('#canvas150');
const canvas800 = document.querySelector('#canvas800');
const canvasHi = document.querySelector('#canvashi');
const canvases = document.querySelectorAll('canvas')
const canvasWrapper = document.querySelector('#canvaswrapper');
const canvasbackground = document.querySelector('#canvasbackground');
const closeButton = document.querySelector('#closebutton');
const keys = document.querySelector('#keys');
const mobileHint = document.querySelector('#touchsvg');
const desktopHint = document.querySelector('#keyswrap');
const hint = document.querySelector('#hintWrap');
const optionswrap = document.querySelector('#optionswrap');
const options = document.querySelector('#options');
const result = document.querySelector('#result');
const paintings = document.querySelector('#paintings');
const drawings = document.querySelector('#drawings');
const main = document.querySelector('main');
const imageArray = [];
let mobile = null;
let currentIndex = null;
let firstTime = true;
let previousScale = 1;
let previousPosition = null;


// create imageArray
Array.from(document.querySelectorAll('img')).forEach((thumbnail, index) => {
    thumbnail.dataIndex = index;
    imageArray.push({ 150: thumbnail });
    thumbnail.addEventListener('error', retry, { once: true })
});

// check device
document.addEventListener('touchstart', () => mobile = true, { once: true });

function highestRes() {
    if (imageArray[currentIndex]['hi']?.complete) return imageArray[currentIndex]['hi']
    if (imageArray[currentIndex]['800']?.complete) return imageArray[currentIndex]['800']
    if (imageArray[currentIndex]['150']?.complete) return imageArray[currentIndex]['150']
}

// draw
function draw() {
    let img
    let canvas
    if (imageArray[currentIndex]['hi']?.complete) {
        img = imageArray[currentIndex]['hi']
        canvas = canvasHi
    }
    else if (imageArray[currentIndex]['800']?.complete) {
        img = imageArray[currentIndex]['800']
        canvas = canvas800
    }
    else if (imageArray[currentIndex]['150']?.complete) {
        img = imageArray[currentIndex]['150']
        canvas = canvas150
    }
    requestAnimationFrame(() => {
        document.querySelector('canvas.display')?.classList.remove('display')
        setTimeout(canvas.classList.add('display'), 200)
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    })
}

// load
function load(res = '800', i = currentIndex) {
    if (!imageArray[i][res]?.complete) {
        const newRes = new Image();
        newRes.srcset = imageArray[i]['150'].srcset.replace('150', res);
        newRes.src = imageArray[i]['150'].src.replace('150', res);
        newRes.addEventListener('load', draw, { once: true })
        newRes.addEventListener('error', retry, { once: true })
        imageArray[i][res] = newRes
    }
}

function retry(e) {
    let retryCount = 0;
    const onError = () => {
        if (retryCount < 3) {
            retryCount++;
            setTimeout(() => {
                e.target.srcset = e.target.srcset;
                e.target.src = e.target.src;
            }, 100);
        }
        else e.target.removeEventListener('error', onError);
    };
    e.target.addEventListener('error', onError);
}

// handle click
document.addEventListener('click', (e) => {
    // click on img
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        // set currentIndex
        currentIndex = e.target.dataIndex
        // show canvas
        e.target.classList.add('clicked')
        display(canvasWrapper)
        display(canvasbackground)
        display(closeButton)
        // update canvas
        load()
        draw()
        // if first time
        if (firstTime) {
            // display hint
            display(hint)
            if (mobile) display(mobileHint)
            else display(desktopHint)
            // remove hint
            hint.addEventListener('animationend', (event) => {
                if ([...hint.children].includes(event.target)) {
                    hide(hintwrap)
                };
            });
            firstTime = false;
        }
        // listen for scroll
        hide(main)
        if (mobile) {
            const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight // changes if menu bar is open
            window.scrollTo(0, Math.round(currentIndex * totalScrollHeight / imageArray.length));
            window.addEventListener('scroll', handleScroll)
            window.addEventListener('touchstart', handleTouchStart);
        }
        else {
            window.addEventListener('keydown', handleKeydown)
            window.addEventListener('wheel', handleWheel);
        }

    }
    // click on canvas
    if (e.target.tagName === 'CANVAS') {
        // display options
        load('hi')
        draw()
        display(optionswrap)
        display(options)
    }
    // click 'download'
    if (e.target.id === 'downloadimg') {
        fetch(imageArray[currentIndex].hi.src)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = '';
                link.click();
                showResult('downloaded');
            });
    }
    // click 'copy'
    if (e.target.id === 'copyimg') {
        const img = highestRes()
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                .then(() => showResult('copied'))
                .catch(() => showResult('failed'));
        }, 'image/png');
    }
    // click 'copy url'
    if (e.target.id === 'copyurl') {
        const url = imageArray[currentIndex]['hi'].src;
        navigator.clipboard.writeText(url)
            .then(() => showResult('copied url'))
            .catch(() => showResult('failed'));
    }
    // click 'close'
    if (e.target.id === 'closebutton' || e.target.parentElement.id === 'closebutton') {
        hide(optionswrap)
        hideCanvas();
    }
    // click options wrap
    if (e.target.id === 'optionswrap') hide(optionswrap)
    // click canvas wrapper
    if (e.target.id === 'canvaswrapper') hideCanvas();
    // click hint
    if (document.getElementById('hintwrap').contains(e.target)) hide(hint);
})






// hide canvas
function hideCanvas() {
    const img = document.querySelectorAll('img')[currentIndex]
    const rect = img.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const elCenterY = rect.top + window.scrollY + rect.height / 2;
    const scrollY = elCenterY - windowHeight / 2;
    // remove listeners
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('keydown', handleKeydown);
    // scroll to the current image
    window.scrollTo(0, scrollY);
    // cleanup
    canvasWrapper.addEventListener('transitionend', () => {
        const canvas = document.querySelector('canvas.display')
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
    }, { once: true });
    display(main)
    // hide canvas
    hide(closeButton)
    hide(canvasWrapper)
    hide(canvasbackground)
}

// keys
function handleKeydown(e) {
    hide(hint)
    if (e.key === "ArrowLeft") {
        if (currentIndex > 0) {
            currentIndex -= 1
            load()
            draw()
            if (currentIndex > 1) load('800', currentIndex - 1)
        } else hideCanvas();
    }
    if (e.key == "ArrowRight") {
        if (currentIndex < imageArray.length - 1) {
            currentIndex += 1
            load()
            draw()
            if (currentIndex < imageArray.length - 2) load('800', currentIndex + 1)
        } else hideCanvas();
    }
    if (e.key === "Escape") {
        e.preventDefault()
        stopZoom()
        hideCanvas()
        hide(options)
    }
}

// scroll
function handleScroll() {
    const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight // changes if menu bar is open
    const scrollPercent = Math.min(Math.max(
        window.scrollY / totalScrollHeight
        , 0), 1) // Clamp the value between 0 and 1
    const docScrolled = window.scrollY
    const windowScrolled = window.innerHeight * scrollPercent
    const scrolled = docScrolled + windowScrolled
    const scrollableHeight = document.documentElement.scrollHeight
    const newIndex = Math.max(Math.min(Math.round(
        scrolled / scrollableHeight * imageArray.length
    ), imageArray.length - 1), 0)
    currentIndex = newIndex
    window.removeEventListener('touchmove', resetZoom)
    window.addEventListener('scroll', () => {hide(hintwrap)}, { once: true });
    load()
    draw()
    if (currentIndex > 1) load('800', currentIndex - 1)
    if (currentIndex < imageArray.length - 2) load('800', currentIndex + 1)
}

function handleTouchStart(e) {
    if (e.touches?.length > 1) {
        handleTouches()
    }
}

function handleTouches() {
    if (!imageArray[currentIndex]['hi']) load('hi')
    if (window.visualViewport.scale <= 1) previousPosition = window.scrollY
    window.removeEventListener('scroll', handleScroll)
    window.addEventListener('touchmove', resetZoom, { once: true })
    window.addEventListener('touchend', handleTouchEnd, { once: true })
}

function handleWheel() {
    if (window.visualViewport.scale > 1) {
        const canvas = canvasHi
        if (canvas.width < document.body.clientWidth) canvas.style.height = canvas.height
        if (canvas.height < document.body.clientHeight) canvas.style.width = canvas.width
        load('hi')
        draw()
        window.removeEventListener('keydown', handleKeydown)
        window.addEventListener('wheel', resetZoom, { once: true })
    }
}

function resetZoom() {
    const currentScale = window.visualViewport.scale.toFixed(2)
    const stoppingZoom = currentScale < 1.2 && currentScale < previousScale
    previousScale = currentScale
    if (stoppingZoom) stopZoom()
}

function handleTouchEnd() {
    if (window.visualViewport.scale < 1.2) stopZoom()
    window.removeEventListener('touchmove', resetZoom)
}

function stopZoom() {
    document.querySelector('canvas.display').style.height = ''
    document.querySelector('canvas.display').style.width = ''
    scrollTo(0, previousPosition)
    if (mobile) window.addEventListener('scroll', handleScroll)
    else window.addEventListener('keydown', handleKeydown)
}

// show result
function showResult(message) {
    result.innerHTML = message;
    hide(options)
    display(result);
    setTimeout(() => {
        hide(optionswrap)
        hide(result)
    }, 500); // 2000 milliseconds = 2 seconds
}

// display
function display(el) {
    el.classList.add('display')
}

// hide
function hide(el) {
    el.classList.remove('display')
}

// function log(...args) {
//     const text = args.join(' ');
//     document.querySelector('#logdiv').innerHTML = text + '<br>' + document.querySelector('#logdiv').innerHTML;
// }

// window.onerror = function (message, url, lineNumber, colNumber, error) {
//     const errorElement = document.createElement('div');
//     errorElement.innerText = `Error: ${message} - ${lineNumber}:${colNumber} - ${error}`;
//     document.getElementById('logdiv').appendChild(errorElement);
//     return true;
// };
