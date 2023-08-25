import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import './index.css';
import base from './base';
import Edit from './Edit';
import Bio from './Bio.js';
import Info from './Info.js';
import MobileImageSection from './MobileImageSection.js';
import DesktopImageSection from './DesktopImageSection.js';
import { paintingData } from './paintingData.js';
import { drawingData } from './drawingData.js';
function App() {
  const [activeIndex, setactiveIndex] = useState(undefined)
  const isMobile = window.innerWidth < 660
  const windowHeight = window.screen.availHeight * window.devicePixelRatio
  let max, i = 0
  while (i < base.sizes.length) {
    max = i
    if (windowHeight < Number(base.sizes[i]) || base.sizes[i] === 'o') break
    i +=1
  }
  const paintingImages = paintingData.map(entry => makeImage(entry.url))
  const drawingImages = drawingData.map(url => makeImage(url))
  function makeImage(url) {
    const img = new Image()
    img.min = img.src = base.url + base.sizes[0] + '/' + url
    img.max = base.url + base.sizes[max] + '/' + url
    img.o = base.url + 'o/' + url
    return img
  }
  return (
    <>
      <Link index="0" name="Kevin Larmee" /> <Link index="1" name="paintings" /> <Link index="2" name="drawings" /> {(activeIndex == 1 || activeIndex == 3) && <Link index="3" name="info" />}
      {(activeIndex !== undefined) && <hr />}
      {(activeIndex == 0) && <Bio />}
      {(activeIndex == 1) && <ImageSection imgs={paintingImages} gallery="paintings" />}
      {(activeIndex == 2) && <ImageSection imgs={drawingImages} gallery="drawings" />}
      {(activeIndex == 3) && <Info />}
    </>
  )
  function Link({ index, name }) {
    return activeIndex === index ? <>{name}</> : <a onClick={(e) => { setactiveIndex(index); e.preventDefault(); }} href="#">{name}</a>
  }
  function ImageSection({ imgs, gallery }) {
    return isMobile ? <MobileImageSection imgs={imgs} gallery={gallery} /> : <DesktopImageSection imgs={imgs} gallery={gallery} />;
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
)