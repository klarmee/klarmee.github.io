import bases from './bases.js'
import React, { useState, useEffect } from 'react';
import { paintingData } from './paintingData.js';

export default function Paintings() {
    const baseLevel = window.innerWidth < 620 ? 0 : 1
    const [activity, setActivity] = useState({ index: -1, level: baseLevel })
    useEffect(() => {

        const observer = new ResizeObserver(() => {
            if (activity.index > -1) {
                document.querySelectorAll('img')[activity.index].scrollIntoView()
            }
        })

        Array.from(document.querySelectorAll('img')).forEach((img) => {
            observer.observe(img)
        })

    })
    
    return (
        <>
            {
                paintingData.map((entry, index) => {
                    const url = entry.url
                    const isActive = activity.index === index
                    return (
                        <React.Fragment key={index}>
                            <img
                                className={isActive ? 'active' : ''}
                                width={isActive ? bases.width[activity.level] + 'px' : bases.width[baseLevel] + 'px'}
                                src={isActive ? bases.url + bases.width[activity.level] + '/' + url : bases.url + bases.width[baseLevel] + '/' + url}
                                onClick={(e) => {
                                    if (activity.index !== index) activate(index)
                                    else expand(e, url)
                                }}
                            />
                            {index + 1}
                        </React.Fragment>
                    )
                })
            }
        </>
    )

    function activate(index) {
        let newActivity = { index: index, level: baseLevel + 1 };
        setActivity(newActivity)
    }

    function expand(e, url, index) {
        if (e.type === 'click') {
            window.open(bases.url + bases.width[bases.width.length - 1].url + url);
        }
        else if (e.touches.length > 1) {
            setActivity({ index: index, level: 3 })
        }
    }
}