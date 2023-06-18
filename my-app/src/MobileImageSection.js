import bases from './bases.js'
import Canvas from './Canvas.js';

export default function MobileImageSection(data) {
    const scrollStep = 16
    let imgs = []
    data.data.forEach(url => {
        let img = {}
        img = new Image()
        img.src = bases.url + bases.width[2] + '/' + url
        img.hi = bases.url + 'o/' + url
        imgs.push(img)
    });
    return (
        <>
            <a className="up" style={{ top: getComputedStyle(document.body).margin }} href="#">^</a>
            <div className="output" style={{ bottom: getComputedStyle(document.body).margin }}>1</div>
            <div className="canvasWrapper">
                <Canvas imgs={imgs} scrollStep={scrollStep} />
            </div>
            <div style={{ height: data.data.length * scrollStep + document.documentElement.clientHeight + 'px' }}></div>
        </>
    )
}