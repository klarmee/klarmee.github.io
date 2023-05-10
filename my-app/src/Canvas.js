import { useRef, useEffect } from 'react'

export default function Canvas({ imgs, scrollStep }) {

    const i = useRef(imgs[0])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        window.addEventListener('scroll', onScrub, { passive: true });
        window.dispatchEvent(new CustomEvent('scroll')) // render image before scroll begins

        return () => window.removeEventListener('scroll', onScrub);

        function onScrub() {
            i.current = imgs[parseInt(Math.floor(window.scrollY / scrollStep))]
            if (i.current !== undefined) {
                // 1. size   2. draw
                setSize(i.current.lo)
                context.drawImage(i.current.lo, 0, 0, i.current.lo.naturalWidth, i.current.lo.naturalHeight)
            }
            window.addEventListener('click', onClick);
            window.visualViewport.addEventListener('resize', onResize)
        }

        function setSize(i) {
            document.querySelector('canvas').width = i.naturalWidth
            document.querySelector('canvas').height = i.naturalHeight
        }

        function onClick(e) {
            if (e.target.tagName === 'CANVAS') {
                window.open(i.current.hi.src);
            }
        }

        function onResize() {
            if (window.visualViewport.scale > 1) {
                window.removeEventListener('scroll', onScrub, { passive: true });
                window.removeEventListener('click', onClick);
                setSize(i.current.hi)
                context.drawImage(i.current.hi, 0, 0, i.current.hi.naturalWidth, i.current.hi.naturalHeight)
            }
            else {
                window.addEventListener('scroll', onScrub, { passive: true });
                window.addEventListener('click', onClick);
                setSize(i.current.lo)
                context.drawImage(i.current.lo, 0, 0, i.current.lo.naturalWidth, i.current.lo.naturalHeight)
            }
        }
    }, [])

    return <canvas ref={canvasRef} />
}