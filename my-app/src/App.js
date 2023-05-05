import { useState } from 'react';
import data from './data.js';
import TextSection from './TextSection.js';
import ImageSection from './ImageSection.js';
import InfoSection from './InfoSection.js';

export default function App() {
  const [onIndex, setonIndex] = useState(0)
  const infoIndex = data.length
  return (
    <>

      {
        data.map((section, index) => {
          return (
            <button key={index} class={onIndex === index ? 'on' : ''} onClick={() => setonIndex(index)}>
              {section.name}
            </button>
          )
        })
      }

      <button class={onIndex === infoIndex ? 'on' : ''} key={infoIndex} onClick={() => setonIndex(infoIndex)}>
        info
      </button>

      {
        data.map((section, index) => {
          if (index === onIndex) {
            if (section.type === 'images') {
              return <ImageSection key={index} section={section} />
            }
            else {
              return <TextSection key={index} section={section} />
            }
          }
        })
      }

      {infoIndex === onIndex && <InfoSection />}

    </>
  )
}