import { useRef, useEffect } from 'react'
export default function MobileImageSection({imgs}) {
    const scrollStep = 16
    return (    
        <>
            <div className="scrubinfo">
                <a href="#">^ </a>
                <span className="output">1</span>
            </div>
            <div className="canvasWrapper">
                <Canvas imgs={imgs} scrollStep={scrollStep} />
            </div>
            <div style={{ height: imgs.length * scrollStep + document.documentElement.clientHeight + 'px' }}></div>
        </>
    )
}
function Canvas({ imgs, scrollStep }) {
    const i = useRef(imgs[0])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        i.current.onload = function () { // initial image before scroll
            setSize(i.current)
            context.drawImage(i.current, 0, 0, i.current.naturalWidth, i.current.naturalHeight)
        }

        window.addEventListener('scroll', onScrub, { passive: true });
        return () => window.removeEventListener('scroll', onScrub);

        function onScrub() {
            i.current = imgs[parseInt(Math.floor(window.scrollY / scrollStep))]
            if (i.current !== undefined) {
                setSize(i.current)
                context.drawImage(i.current, 0, 0, i.current.naturalWidth, i.current.naturalHeight)
                document.querySelector('.output').innerHTML = parseInt(Math.floor(window.scrollY / scrollStep)) + 1
            }
            ['wheel', 'touchstart', 'touchmove'].forEach((event) => window.addEventListener(event, onZoom))
        }

        function onZoom(e) {
            if (window.visualViewport.scale > 1 || (e.touches && e.touches.length === 2)) {
                let img = new Image()
                img.src = i.current.hi
                img.onload = function () {
                    setSize(img)
                    context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
                }
                window.removeEventListener('scroll', onScrub)
                ['wheel', 'touchstart', 'touchmove'].forEach((event) => window.removeEventListener(event, onZoom))
                ['wheel', 'touchend'].forEach((event) => window.addEventListener(event, onReset))
            }
        }

        function onReset() {
            if (window.visualViewport.scale === 1) {
                ['wheel', 'touchend'].forEach((event) => window.removeEventListener(event, onReset))
                window.addEventListener('scroll', onScrub, { passive: true });
            }
        }

    }, [])

    function setSize(i) {
        document.querySelector('.canvas').width = i.naturalWidth
        document.querySelector('.canvas').height = i.naturalHeight
    }

    return <canvas className="canvas" ref={canvasRef} />
}