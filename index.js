const canvas = document.querySelector('canvas');
const canvasWrapper = document.querySelector('#canvaswrapper');
const canvasWrapperBackground = document.querySelector('#canvaswrapperBackground');
const keys = document.querySelector('#keys');
const touchwrap = document.querySelector('#touchwrap');
const keyswrap = document.querySelector('#keyswrap');
const hintWrap = document.querySelector('#hintWrap');
const paintings = document.querySelector('#paintings');
const drawings = document.querySelector('#drawings');
const imageArray = [];
let scrollable = document.documentElement.scrollHeight - window.innerHeight
let currentIndex = null;
let hinting = false;
let displayedHint = false;
let mobile = false;
let previousScale = 1;
let scrollPosition = null;





// create imageArray


Array.from(document.querySelectorAll('img')).forEach((thumbnail, index) => {
    imageArray.push({
        lo: {
            img: thumbnail,
            src: thumbnail.src,
            loading: true,
            loaded: false
        },
        med: {
            img: null,
            src: thumbnail.src.replace('150', '800'),
            loading: false,
            loaded: false
        },
        hi: {
            img: null,
            src: thumbnail.src.replace('150', 'hi'),
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
        e.target.parentElement.style.backgroundImage = `url(${e.target.src})`
        e.target.addEventListener('animationend', removeClass)
        e.target.classList.add('clicked');

        startPreview()
    }
    if (e.target.tagName === 'CANVAS') {
        // show options to download, open in new tab, or close
    }
    if (e.target.id === 'close') endPreview();
    
}

function handleFirstScroll(e) {
    e.stopPropagation()
    if (e.target.parentElement == hintWrap) {
        window.addEventListener('scroll', handleScroll);
        scrollPosition = window.scrollY;
        document.body.style.visibility = 'hidden'
        console.log('scrolling to ',Math.round(scrollable * currentIndex / imageArray.length), 'index ',currentIndex)
        scrollTo(0, Math.round(currentIndex * scrollable / imageArray.length));
        console.log('scrolled to ',window.scrollY)
        document.body.style.visibility = ''    
    }
}

function startPreview() {
    canvasWrapper.classList.add('display')
    canvasWrapperBackground.classList.add('display')

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
    canvasWrapperBackground.classList.remove('display')
    img.classList.add('unclicked');
    img.addEventListener('animationend', removeClass)
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
            image['img'] = newImage;
            image['loading'] = true;

            newImage.onload = () => {
                image['loading'] = false;
                image['loaded'] = true;
                drawCurrentImage();
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
        endPreview();
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
        if (mobile) touchwrap.classList.add('display')
        else keyswrap.classList.add('display')
        hintWrap.addEventListener('animationend', endHint)
    }
}

function endHint(e) {
    e.stopPropagation()
    if (e.target.parentElement == hintWrap) {
        Array.from(hintWrap.children).forEach(child => child.removeEventListener('animationend', endHint))
        hintWrap.remove();
    }
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
