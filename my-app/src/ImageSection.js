import bases from './bases.js'
import { useState } from 'react';
import Canvas from './Canvas';

export default function ImageSection({ section, on }) {
  const scrollStep = 16
  const initColumns = Math.round(4 + ((window.innerWidth - 400) / 200))
  const initActivity = { index: -1, level: 0 }
  const initLayout = { columns: initColumns, imgSize: 0 }

  const [activity, setActivity] = useState(initActivity)
  const [layout, setLayout] = useState(initLayout)
  let imgs = []
  section.entries.forEach(entry => {
    let img = new Image()
    img.src = window.innerWidth * window.devicePixelRatio > bases[0].width ? bases[1].url + entry.url : bases[0].url + entry.url
    imgs.push(img)
  });

  const columns = layout.columns
  const isScrub = layout.columns === 0
  const sectionScrubHeight = section.entries.length * scrollStep + document.documentElement.clientHeight + 'px'
  const sectionStyle = isScrub ? { height: sectionScrubHeight } : { height: 'auto' }
  const sectionClassName = isScrub ? section.name + ' images' + ' scrub' : section.name + ' images'
  return (
    <section
      className={sectionClassName}
      style={sectionStyle}
      tabIndex='0'
      onKeyDown={activate}
      onTouchStart={expand}
    >
      <input type='range' step='10'
        value={100 - columns * 10}
        onChange={(e) => {
          const newColumns = Math.round((100 - e.target.value) / 10)
          if (columns !== newColumns) {
            setActivity({ ...activity, index: -1 })
            // if (window width > small image width)
            if ((window.innerWidth * window.devicePixelRatio) - (newColumns * bases[0].width) > (bases[0].width)) {
              setLayout({ columns: newColumns, imgSize: 1 })
            } else setLayout({ columns: newColumns, imgSize: 0 })
          }
        }}
      />
      {columns === 0 &&
        <div className="canvasWrapper">
          <Canvas imgs={imgs} scrollStep={scrollStep} imageSize={layout.imgSize} />
        </div>
      }
      {columns > 0 &&
        <div className='contents' style={{ gridTemplateColumns: 'repeat(' + columns.toString() + ', 1fr)' }}>
          {
            section.entries.map((entry, index) => {
              const url = entry.url
              const activated = activity.index === index
              const activeStyle = {
                gridColumn: `1 / calc(${columns} + 1)`
              }
              return (
                <figure key={index} style={activated ? activeStyle : {}}>
                  <img
                    className={activated ? 'active' : ''}
                    width={activated ? bases[activity.level].width + 'px' : bases[layout.imgSize].width + 'px'}
                    src={activated ? bases[activity.level].url + url : bases[layout.imgSize].url + url}
                    data-original={bases[2].url + url}
                    onClick={(e) => {
                      if (activity.index !== index) activate(e, index)
                      else if (activity.index === index && activity.level === 1) expand(e, url)
                    }}
                  />
                  <figcaption>{index + 1}</figcaption>
                </figure>
              )
            })
          }
        </div>
      }
    </section >
  )

  function activate(e, index) {
    let newActivity = {}
    switch (e.type) {
      case 'click': newActivity = { index: index, level: 1 }; break
      case 'keydown':
        switch (e.key) {
          case 'ArrowRight':
            newActivity =
              { index: activity.index + 1, level: 1 }
            break
          case 'ArrowLeft':
            newActivity =
              { index: activity.index - 1, level: 1 }
            break
        }
        break
    }
    const targetElement = document.querySelector('.contents').children[newActivity.index]
    const observer = new ResizeObserver((entries, observer) => {
      targetElement.scrollIntoView()
      observer.unobserve(targetElement);
    })
    if (newActivity.index > -1 && newActivity.index < section.entries.length) {
      observer.observe(targetElement);
      setActivity(newActivity)
    }
  }

  function expand(e, url) {
    if (e.type === 'click') {
      window.open(bases[2].url + url);
    }
    else if (e.touches.length > 1) {
      setActivity({ ...activity, level: 2 })
    }
  }
}