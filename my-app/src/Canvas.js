import { useRef, useEffect } from 'react'

export default function Canvas({ imgs, scrollStep }) {

    const i = useRef(imgs[0])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        i.current.onload = function() { // initial image before scroll
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
            window.addEventListener('wheel', onZoom);
            window.addEventListener('touchstart', onZoom);
            window.addEventListener('touchmove', onZoom);
        }

        function onZoom(e) {
            if (window.visualViewport.scale > 1 || (e.touches && e.touches.length == 2)) {
                let img = new Image()
                img.src = i.current.hi
                img.onload = function () {
                    setSize(img)
                    context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
                }
                window.addEventListener('wheel', onReset);
                window.addEventListener('touchend', onReset);
                window.removeEventListener('scroll', onScrub)
                window.removeEventListener('wheel', onZoom);
                window.addEventListener('touchstart', onZoom);
                window.removeEventListener('touchmove', onZoom);
            }
        }

        function onReset() {
            if (window.visualViewport.scale == 1) {
                window.addEventListener('scroll', onScrub, { passive: true });
                window.removeEventListener('wheel', onReset);
                window.removeEventListener('touchend', onReset);
            }
        }

    }, [])

    function setSize(i) {
        document.querySelector('.canvas').width = i.naturalWidth
        document.querySelector('.canvas').height = i.naturalHeight
    }

    return <canvas className="canvas" ref={canvasRef} />

}