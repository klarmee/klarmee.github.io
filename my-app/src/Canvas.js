import { useRef, useEffect } from 'react'

export default function Canvas({ imgs, scrollStep }) {

    const i = useRef(imgs[0])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        function onScrub() {
            i.current = imgs[parseInt(Math.floor(window.scrollY / scrollStep))]
            if (i.current !== undefined) {
                document.querySelector('.canvasWrapper canvas').width = i.current.naturalWidth
                document.querySelector('.canvasWrapper canvas').height = i.current.naturalHeight
                context.drawImage(i.current, 0, 0, i.current.naturalWidth, i.current.naturalHeight)
                console.log(i.current.naturalHeight);
            }
        }
        window.addEventListener('scroll', onScrub, { passive: true });
        window.dispatchEvent(new CustomEvent('scroll'))
        return () => window.removeEventListener('scroll', onScrub);

    }, [])

    return <canvas ref={canvasRef}/>
}