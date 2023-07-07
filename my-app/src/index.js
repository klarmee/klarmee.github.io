import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import './index.css';
import bases from './bases';
import Bio from './Bio.js';
import Info from './Info.js';
import MobileImageSection from './MobileImageSection.js';
import DesktopImageSection from './DesktopImageSection.js';
import { paintingData } from './paintingData.js';
import { drawingData } from './drawingData.js';
function App() {
  const [activeIndex, setactiveIndex] = useState(undefined)
  const mobile = window.innerWidth < 660
  const min = window.innerWidth > 1300 ? 400 : 200  
  const max = window.innerWidth * window.devicePixelRatio > 900 && window.innerHeight * window.devicePixelRatio > 900 ? 'o' : 800
  const paintingImages = paintingData.map(entry=> makeImage(entry.url))
  const drawingImages = drawingData.map(url => makeImage(url))
  function makeImage(url) {
    let img = new Image()
    img.min = img.src = mobile ? bases.url + '800/' + url : bases.url + min + '/' + url
    img.max = bases.url + max + '/' + url
    img.o = bases.url + 'o/' + url
    return img
  }
  return (
    <>
      <Link index="0" name="Kevin Larmee" /> <Link index="1" name="paintings" /> <Link index="2" name="drawings" /> {(activeIndex == 1 || activeIndex == 3) && <Link index="3" name="info" />}
      {(activeIndex !== undefined) && <hr />}
      {(activeIndex == 0) && <Bio />}
      {(activeIndex == 1) && <ImageSection imgs={paintingImages} />}
      {(activeIndex == 2) && <ImageSection imgs={drawingImages} />}
      {(activeIndex == 3) && <Info />}
    </>
  )
  function Link({ index, name }) {
    return activeIndex === index ? <>{name}</> : <a onClick={(e) => { setactiveIndex(index); e.preventDefault(); }} href="#">{name}</a>
  }
  function ImageSection({ imgs }) {
    return mobile ? <MobileImageSection imgs={imgs} /> : <DesktopImageSection imgs={imgs} />;
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
)