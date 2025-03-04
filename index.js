const canvas = document.querySelector('canvas');
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
const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight
const imageArray = [];
let mobile = null;
let currentIndex = null;
let firstTime = true;
let previousScale = 1;
let zooming = false;

// create imageArray
Array.from(document.querySelectorAll('img')).forEach((thumbnail, index) => {
    thumbnail.dataIndex = index; // set index
    imageArray.push({
        lo: {
            img: thumbnail,
            srcset: thumbnail.srcset,
            src: thumbnail.src,
            loading: true,
            loaded: false
        },
        med: {
            img: null,
            srcset: thumbnail.srcset.replace('150', '800'),
            src: thumbnail.src.replace('150', '800'),
            loading: false,
            loaded: false
        },
        hi: {
            img: null,
            srcset: thumbnail.srcset.replace('150', 'hi'),
            src: thumbnail.src.replace('150', 'hi'),
            loading: false,
            loaded: false
        }
    });
    if (thumbnail.complete) {
        imageArray[index].lo.loading = false;
        imageArray[index].lo.loaded = true;
    }
    else {
        thumbnail.onload = () => {
            imageArray[index].lo.loading = false;
            imageArray[index].lo.loaded = true;
        };
    }
    // retry on error
    const maxRetries = 3;
    let retryCount = 0;
    thumbnail.onerror = () => {
        imageArray[index].lo.loading = true;
        imageArray[index].lo.loaded = false;
        if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(() => {
                thumbnail.src = thumbnail.src; // Reset the src attribute to reload the image
            }, 100);
            console.error(`Trying to load image after ${retryCount} retries.`);
        } else console.error(`Failed to load image after ${maxRetries} retries.`);
    };
});

// check device
document.addEventListener('touchstart', () => mobile = true, { once: true });

// handle click
document.addEventListener('click', (e) => {
    // click on thumbnail
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        const thumbnail = e.target
        // set currentIndex
        currentIndex = thumbnail.dataIndex
        // animate thumbnail
        thumbnail.addEventListener('transitionend', () => thumbnail.className = '', { once: true });
        thumbnail.classList.add('clicked');
        // show canvas
        display(canvasWrapper)
        display(canvasbackground)
        display(closeButton)
        // update canvas
        updateCanvas()
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
        if (mobile) {
            scrollTo(0, Math.round(currentIndex * totalScrollHeight / imageArray.length));
            window.addEventListener('scroll', handleScroll);
        }
        // listen for keydown
        else {
            document.body.style.overflowY = 'hidden';
            window.addEventListener('keydown', handleKeydown);
        }
        // listen for zoom
        window.ontouchmove = window.onwheel = startZoom
    }
    // click on canvas
    if (e.target.tagName === 'CANVAS') {
        // display options
        updateCanvas('hi')
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
        let img;
        // find highest loaded resolution
        if (imageArray[currentIndex].hi.loaded) img = imageArray[currentIndex].hi.img
        else if (imageArray[currentIndex].med.loaded) img = imageArray[currentIndex].med.img
        else if (imageArray[currentIndex].lo.loaded) img = imageArray[currentIndex].lo.img
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
        const url = imageArray[currentIndex].hi.src;
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
    if (e.target.id === 'hintwrap') hide(hint)
})

// update canvas
function updateCanvas(res = 'med') {
    // get neighbor images
    let left = (currentIndex > 0) ? currentIndex - 1 : currentIndex;
    let right = (currentIndex < imageArray.length - 1) ? currentIndex + 1 : currentIndex;
    if (res === 'hi') left = right = currentIndex // don't get hiRes neighbors
    // for each image
    for (let i = left; i <= right; i++) {
        console.log(i,imageArray[i])
        const image = imageArray[i][res];
        // if it's not loaded and it's not loading
        if (!image.loaded && !image.loading) {
            const newImage = new Image();
            // load it
            newImage.srcset = image.srcset;
            newImage.src = image.src;
            // add it to imageArray
            image.img = newImage;
            image.loading = true;
            // and draw it to canvas
            newImage.onload = () => {
                image.loading = false;
                image.loaded = true;
                if (imageArray[i].lo.img?.dataIndex == currentIndex) updateCanvas();
            };
            newImage.onerror = () => console.error('error loading ' + image);
        }
        // if it's loaded and current
        if (image.loaded && imageArray[i].lo.img?.dataIndex == currentIndex) {
            let img;
            // find its highest loaded resolution
            if (imageArray[currentIndex].hi.loaded) img = imageArray[currentIndex].hi.img
            else if (imageArray[currentIndex].med.loaded) img = imageArray[currentIndex].med.img
            else if (imageArray[currentIndex].lo.loaded) img = imageArray[currentIndex].lo.img
            // and draw it
            requestAnimationFrame(() => {
                canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
                canvas.getContext("2d").drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            })
        }
    }
}

requestIdleCallback(() => {
    for (let i = 0; i < imageArray.length; i++) {
        const image = imageArray[i].med;
        if (!image.loaded && !image.loading) {
            const newImage = new Image();
            newImage.srcset = image.srcset;
            newImage.src = image.src;
            image.img = newImage;
            image.loading = true;
            newImage.onload = () => {
                image.loading = false;
                image.loaded = true;
            };
            newImage.onerror = () => console.error('error loading ' + image);
        }
    }
});

// hide canvas
function hideCanvas() {
    const img = document.querySelectorAll('img')[currentIndex]
    const rect = img.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const elCenterY = rect.top + window.scrollY + rect.height / 2;
    const scrollY = elCenterY - windowHeight / 2;
    // remove listeners
    if (mobile) window.removeEventListener('scroll', handleScroll);
    else {
        document.body.style.overflowY = '';
        window.removeEventListener('keydown', handleKeydown);
    }
    // scroll to the current image
    window.scrollTo(0, scrollY);
    // cleanup
    img.addEventListener('transitionend', () => img.className = '', { once: true });
    canvasWrapper.addEventListener('transitionend', () => {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
    }, { once: true });
    // hide canvas
    hide(closeButton)
    hide(canvasWrapper)
    hide(canvasbackground)
    img.classList.add('unclicked');
}

// keys
function handleKeydown(e) {
    hide(hint)
    if (e.key === "ArrowLeft") {
        if (currentIndex > 0) {
            currentIndex -= 1
            updateCanvas()
        } else hideCanvas();
    }
    if (e.key == "ArrowRight") {
        if (currentIndex < imageArray.length - 1) {
            currentIndex += 1
            updateCanvas()
        } else hideCanvas();
    }
    if (e.key === "Escape") {
        e.preventDefault()
        if (zooming) endZoom()
        else hideCanvas()
        hide(options)
    }
}

// scroll
function handleScroll() {
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
    updateCanvas()
}

// start zoom
function startZoom(e) {
    if (window.visualViewport.scale > 1 || e.touches?.length > 1) {
        zooming = true
        if (canvas.width < document.body.clientWidth) canvas.style.height = canvas.height
        if (canvas.height < document.body.clientHeight) canvas.style.width = canvas.width
        updateCanvas('hi')
        window.removeEventListener('keydown', handleKeydown)
        window.onscroll = window.ontouchmove = null
        window.ontouchend = window.onwheel = endZoom
    }
}

// end zoom
function endZoom() {
    const currentScale = window.visualViewport.scale
    if (previousScale > currentScale && currentScale < 1.25) {
        window.visualViewport.scale = previousScale = 1
        zooming = false;
        canvas.style.height = ''
        canvas.style.width = ''
        updateCanvas()
        window.ontouchend = null
        if (mobile) window.onscroll = handleScroll
        else window.addEventListener('keydown', handleKeydown)
        window.ontouchmove = window.onwheel = startZoom
    } else previousScale = currentScale
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