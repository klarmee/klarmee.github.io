import { useState } from 'react';
import Bio from './Bio.js';
import Info from './Info.js';
import MobileImageSection from './MobileImageSection.js';
import DesktopImageSection from './DesktopImageSection.js';
import { drawingData } from './drawingData.js';
import { paintingData } from './paintingData.js';

export default function App() {
  const [activeIndex, setactiveIndex] = useState(undefined)
  const mobile = window.innerWidth < 660

  return (
    <>
      <nav>
        <Link index="0" name="Kevin Larmee" /> <Link index="1" name="paintings" /> <Link index="2" name="drawings" /> {(activeIndex == 1 || activeIndex == 3) && <Link index="3" name="info" />}
        <hr />
      </nav>
      {(activeIndex == 0) && <Bio />}
      {(activeIndex == 1) && <ImageSection name="paintings" />}
      {(activeIndex == 2) && <ImageSection name="drawings" />}
      {(activeIndex == 3) && <Info />}
    </>
  )
  function Link({ index, name }) {
    return activeIndex === index ? <>{name}</> : <a onClick={(e) => {setactiveIndex(index); e.preventDefault();}} href="#">{name}</a>
  }
  function ImageSection(name) {
    const data = name.name == 'paintings' ? paintingData.map(a => a.url) : drawingData
    return mobile ? <MobileImageSection data={data} /> : <DesktopImageSection data={data} />;
  }
}