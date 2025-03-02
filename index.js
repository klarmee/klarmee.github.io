const canvas = document.querySelector('canvas');
const canvasWrapper = document.querySelector('#canvaswrapper');
const canvasbackground = document.querySelector('#canvasbackground');
const closeButton = document.querySelector('#closebutton');
const keys = document.querySelector('#keys');
const touchsvg = document.querySelector('#touchsvg');
const keyswrap = document.querySelector('#keyswrap');
const hintWrap = document.querySelector('#hintWrap');
const optionswrap = document.querySelector('#optionswrap');
const paintings = document.querySelector('#paintings');
const drawings = document.querySelector('#drawings');
const optionsresult = document.querySelector('#optionsresult')
const loadall = document.querySelector('#loadall')
const imageArray = [];
let scrollable = document.documentElement.scrollHeight - window.innerHeight
let currentIndex = null;
let hinting = false;
let showingOptions = false;
let displayedHint = false;
let mobile = false;
let previousScale = 1;
let scrollPosition = null;
let loadingall = false;




// create imageArray


Array.from(document.querySelectorAll('img')).forEach((thumbnail, index) => {
    let retryCount = 0;
    const maxRetries = 3;

    imageArray.push({
        lo: {
            img: thumbnail,
            src: thumbnail.src,
            srcset: thumbnail.srcset,
            loading: true,
            loaded: false
        },
        med: {
            img: null,
            src: thumbnail.src.replace('150', '800'),
            srcset: thumbnail.srcset.replace('150', '800'),
            loading: false,
            loaded: false
        },
        hi: {
            img: null,
            src: thumbnail.src.replace('150', 'hi'),
            srcset: thumbnail.srcset.replace('150', 'hi'),
            loading: false,
            loaded: false
        }
    });

    if (thumbnail.complete) {
        imageArray[index].lo.loading = false;
        imageArray[index].lo.loaded = true;
    } else {
        // If the image is not loaded, set the onload event
        thumbnail.onload = () => {
            imageArray[index].lo.loading = false;
            imageArray[index].lo.loaded = true;
        };
    }
    thumbnail.onerror = () => {
        imageArray[index].lo.loading = true;
        imageArray[index].lo.loaded = false;

        if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(() => {
                thumbnail.src = thumbnail.src; // Reset the src attribute to reload the image
            }, 100); // Delay in milliseconds (1 second in this example)
            console.error(`Trying to load image after ${retryCount} retries.`);
        } else {
            console.error(`Failed to load image after ${maxRetries} retries.`);
        }
    };
    thumbnail.dataIndex = index;
});





// add listeners



document.addEventListener('click', handleClick);

document.addEventListener('touchstart', checkDevice);
function checkDevice() {
    mobile = true;
    document.removeEventListener('touchstart', checkDevice);
}





// handle click



function handleClick(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        currentIndex = e.target.dataIndex
        e.target.addEventListener('transitionend', removeClass)
        e.target.classList.add('clicked');

        startPreview()
    }
    if (e.target.tagName === 'CANVAS') {
        loadDraw('hi')
        optionswrap.classList.add('display')
        showingOptions = true
    }
    if (e.target.id === 'optionswrap') {
        optionswrap.classList.remove('display')
        showingOptions = false
    }
    if (e.target.id === 'copyimg') {
        copyImage()
    }
    if (e.target.id === 'downloadimg') {
        downloadimg()
    }
    if (e.target.id === 'copyurl') {
        copyUrl()
    }
    if (e.target.id === 'closebutton') {
        optionswrap.classList.remove('display')
        showingOptions = false
        endPreview();
    }
    // if (e.target.id === 'loadall') {
    //     if (!loadingall) {
    //         e.target.style.color = 'transparent'
    //         e.target.blur()
    //         const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
    //         e.target.style.backgroundImage = `linear-gradient(to right, ${bgColor} 0%, ${bgColor} 0%, transparent 0%)`; // Initialize gradient
    //         e.target.style.backgroundSize = '100% 100%'; // Set background size to 100%


    //         const totalImages = document.querySelectorAll('img').length;
    //         let loadedImages = 0;


    //         Array.from(document.querySelectorAll('img')).forEach((thumbnail, index) => {
    //             let retryCount = 0;
    //             const maxRetries = 3;
    //             const newSrc = thumbnail.src.replace('150/', 'hi/');
    //             const newSrcSet = thumbnail.srcset.replace('150/', 'hi/');
    //             const newImage = new Image();
    //             newImage.src = newSrc;
    //             newImage.srcset = newSrcSet;
    //             imageArray[index].med.img = newImage


    //             if (newImage.complete) {
    //                 imageArray[index].med.loading = false;
    //                 imageArray[index].med.loaded = true;
    //                 loadedImages++


    //                 const progress = (loadedImages / totalImages) * 100;
    //                 e.target.style.backgroundImage = `linear-gradient(to right, ${bgColor} 0%, ${bgColor} ${progress}%, transparent ${progress}%)`; // Update gradient


    //                 if (loadedImages === totalImages) {
    //                     e.target.innerHTML = 'Loaded';
    //                     e.target.style.backgroundImage = `linear-gradient(to right, ${bgColor} 0%, ${bgColor} 100%)`; // Set final gradient color
    //                 }
    //             } else {
    //                 // If the image is not loaded, set the onload event
    //                 newImage.onload = () => {
    //                     imageArray[index].med.loading = false;
    //                     imageArray[index].med.loaded = true;
    //                     loadedImages++


    //                     const progress = (loadedImages / totalImages) * 100;
    //                     e.target.style.backgroundImage = `linear-gradient(to right, ${bgColor} 0%, ${bgColor} ${progress}%, transparent ${progress}%)`; // Update gradient
    //                 };
    //             }


    //             newImage.onerror = () => {
    //                 imageArray[index].med.loading = true;
    //                 imageArray[index].med.loaded = false;


    //                 if (retryCount < maxRetries) {
    //                     retryCount++;
    //                     setTimeout(() => {
    //                         newImage.src = newImage.src; // Reset the src attribute to reload the image
    //                     }, 100); // Delay in milliseconds (1 second in this example)
    //                     console.error(`Trying to load image after ${retryCount} retries.`);
    //                 } else {
    //                     console.error(`Failed to load image after ${maxRetries} retries.`);
    //                 }
    //             };
    //         });
    //     }
    //     loadingall = true;
    // }
}

function handleFirstScroll(e) {
    e.stopPropagation()
    if (e.target.parentElement == hintWrap) {
        window.addEventListener('scroll', handleScroll);
        scrollPosition = window.scrollY;
        document.body.style.visibility = 'hidden'
        console.log('scrolling to ', Math.round(scrollable * currentIndex / imageArray.length), 'index ', currentIndex)
        scrollTo(0, Math.round(currentIndex * scrollable / imageArray.length));
        console.log('scrolled to ', window.scrollY)
        document.body.style.visibility = ''
    }
}

function startPreview() {
    canvasWrapper.classList.add('display')
    canvasbackground.classList.add('display')
    closeButton.classList.add('display')

    if (mobile) {
        hintWrap.addEventListener('animationend', handleFirstScroll)
    }
    else {
        document.body.style.overflowY = 'hidden';
        window.addEventListener('keydown', handleKeydown);
    }

    startHint();
    loadDraw()

    window.ontouchmove = window.onwheel = startZoom
}

function endPreview() {
    const img = currentImage()
    setTimeout(function () { canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height) }, 500);

    if (mobile) {
        document.body.style.height = ''
        window.removeEventListener('scroll', handleScroll);
        document.body.style.visibility = 'hidden'
        scrollTo(0, scrollPosition);
        document.body.style.visibility = ''
    }
    else {
        document.body.style.overflowY = '';
        window.removeEventListener('keydown', handleKeydown);
    }

    canvasWrapper.classList.remove('display')
    canvasbackground.classList.remove('display')
    closeButton.classList.remove('display')
    img.classList.add('unclicked');
    img.addEventListener('transitionend', removeClass)
}





// load current image and neighbors and draw current image



function loadDraw(res = 'med', i = currentIndex) {
    let start = (i > 0) ? i - 1 : i;
    let end = (i < imageArray.length - 1) ? i + 1 : i;
    if (res === 'hi') start = end = i // don't load hiRes neighbors

    for (let j = start; j <= end; j++) {
        const image = imageArray[j][res];

        if (!image['img']?.complete) {
            const newImage = new Image();
            newImage.src = image['src'];
            newImage.srcset = image['srcset'];
            image['img'] = newImage;
            image['loading'] = true;

            newImage.onload = () => {
                image['loading'] = false;
                image['loaded'] = true;
                drawCurrentImage();
            };

            newImage.onerror = () => {
                console.log('error loading ' + image)
            };

        } else {
            drawCurrentImage();
        }
    }
}


function drawCurrentImage() {
    const img = currentImage()
    requestAnimationFrame(() => {
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    });
}


function currentImage() {
    if (imageArray[currentIndex].hi.loaded) return imageArray[currentIndex].hi.img
    if (imageArray[currentIndex].med.loaded) return imageArray[currentIndex].med.img
    if (imageArray[currentIndex].lo.loaded) return imageArray[currentIndex].lo.img
}










// keys 


function handleKeydown(e) {

    if (e.key === "ArrowLeft") {

        if (currentIndex > 0) {
            currentIndex -= 1
            loadDraw()
        }
        else endPreview();
    }

    if (e.key == "ArrowRight") {

        if (currentIndex < imageArray.length - 1) {
            currentIndex += 1
            loadDraw()
        }
        else endPreview();
    }

    if (e.key === "Escape") {
        e.preventDefault()
        if (!hinting && !showingOptions) endPreview()
        if (showingOptions) {
            optionswrap.classList.remove('display')
            showingOptions = false
        }
        if (hinting) endHint()
    }
}






// scroll


function handleScroll() {
    currentIndex = i()
    loadDraw()
}

function startZoom(e) {
    if (window.visualViewport.scale > 1 || e.touches?.length > 1) {
        if (canvas.width < document.body.clientWidth) canvas.style.height = canvas.height
        if (canvas.height < document.body.clientHeight) canvas.style.width = canvas.width
        loadDraw('hi')
        window.removeEventListener('keydown', handleKeydown)
        window.addEventListener('keydown', handleEscape)
        window.onscroll = window.ontouchmove = null
        window.ontouchend = window.onwheel = endZoom
    }
}

function handleEscape(e) {
    if (e.key === "Escape") {
        window.visualViewport.scale = 1
        endZoom()
        window.removeEventListener('keydown', handleEscape)

    }
}

function endZoom() {
    const currentScale = window.visualViewport.scale
    if (previousScale > currentScale && currentScale < 1.25) {
        canvas.style.height = ''
        canvas.style.width = ''
        drawCurrentImage()
        window.ontouchend = null
        if (mobile) window.onscroll = handleScroll
        else window.addEventListener('keydown', handleKeydown)
        window.ontouchmove = window.onwheel = startZoom
        previousScale = 1
    } else previousScale = currentScale
}






// hint

function startHint() {
    if (!displayedHint) {
        displayedHint = true;
        hintWrap.classList.add('display')
        if (mobile) touchsvg.classList.add('display')
        else keyswrap.classList.add('display')
        hintWrap.addEventListener('animationend', (event) => {
            if ([...hintWrap.children].includes(event.target)) {
                endHint();
            }
        });
        hinting = true
    }
}

function endHint(e) {
    hintWrap.remove();
    hinting = false
}



function img() { return imageArray[i()] }
function i() {
    const docScrolled = window.scrollY
    const windowScrolled = window.innerHeight * scrollPercent()
    const scrolled = docScrolled + windowScrolled
    const scrollable = document.documentElement.scrollHeight // scrollable in this context where windowScrolled adds window.innerHeight the amount scrolled when user reaches the bottom
    const result = Math.max(Math.min(Math.round(
        scrolled / scrollable * imageArray.length
    ), imageArray.length - 1), 0)
    console.log('scrolledHeight', scrolled, 'scrollableHeight', scrollable, 'scrolledHeight / scrollableHeight', scrolled / scrollable, 'imageArray.length', imageArray.length, 'scrollPercent()', scrollPercent(), 'i', result)
    return result
}
function scrollPercent() {
    const result = Math.min(Math.max(
        window.scrollY / scrollable
        , 0), 1)
    return result
}



function removeClass(e) {
    e.target.className = "";
    e.target.removeEventListener(e.type, removeClass)
}

// download img

function downloadimg() {
    const url = imageArray[currentIndex].hi.src;
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = '';
        link.click();
        showResult('downloaded');
      });
  }

function getFileExtension(url) {
    const urlParts = url.split('.');
    return urlParts[urlParts.length - 1].toLowerCase();
}

function copyImage() {
    // load med or hi
    let img = imageArray[currentIndex].med.img
    if (imageArray[currentIndex].hi.img.complete && imageArray[currentIndex].hi.img.naturalWidth !== 0) {
        img = imageArray[currentIndex].hi.img
    }
    // Create a canvas element to draw the image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Get the canvas data URL
    canvas.toBlob((blob) => {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
            .then(() => showResult('copied'))
            .catch(() => showResult('failed'));
    }, 'image/png');
}

function copyUrl() {
    const url = imageArray[currentIndex].hi.src;
    navigator.clipboard.writeText(url)
        .then(() => showResult('copied'))
        .catch(() => showResult('failed'));
}

function showResult(message) {
    optionswrap.classList.remove('display');
    optionsresult.innerHTML = message;
    optionsresult.classList.add('display');
    optionsresult.addEventListener('animationend', () => {
        optionsresult.classList.remove('display');
    }, { once: true });
}