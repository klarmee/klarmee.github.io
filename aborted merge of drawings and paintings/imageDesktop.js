import React, { useState, useEffect, Fragment } from 'react';
export default function ImageDesktop({ imgs }) {
    const [activeIndex, activateIndex] = useState(-1)
    useEffect(() => {
        let imgs = document.querySelectorAll('img')
        const observer = new ResizeObserver(() => { if (activeIndex > -1) imgs[activeIndex].scrollIntoView() })
        Array.from(imgs).forEach((img) => { observer.observe(img) })
        window.onkeydown = function (e) {
            if (e.key == 'ArrowRight' && activeIndex < imgs.length - 1) activateIndex(activeIndex + 1)
            if (e.key == 'ArrowLeft' && activeIndex > 0) activateIndex(activeIndex - 1)
        }
    })
    const images = imgs.map((img, index) => {
        const active = index == activeIndex
        let activestyle = img.naturalWidth / img.naturalHeight > window.innerWidth / window.innerHeight ? // img proportionally wider than window ?
        {width: window.innerWidth} : {height: window.innerHeight} 
        return (
            < Fragment key={index} >
                <img
                    className={active ? 'maxed' : ''}
                    src={active ? img.max : img.min}
                    style={active ? activestyle : {}}
                    onClick={(e) => { active ? expand(e, img.o) : activateIndex(index) }}
                />                
            </Fragment >
        )
    })
    return <>{images}</>
    function expand(e, url) {
        if (e.type === 'click') {
            window.open(url);
        }
        else if (e.touches.length == 2) {
            document.querySelectorAll('img')[activeIndex].src = url
        }
    }
}