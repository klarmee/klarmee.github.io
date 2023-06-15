import { useState } from 'react';
import Bio from './Bio.js';
import Info from './Info.js';
import Paintings from './Paintings.js';
import Drawings from './Drawings.js';
export default function App() {
  const [activeIndex, setactiveIndex] = useState(undefined)
  function Link({ index, name }) {
    return activeIndex === index ? <>{name}</> : <a onClick={() => setactiveIndex(index)} href="#">{name}</a>
  }
  return (
    <>
      <Link index="0" name="Kevin Larmee" /> <Link index="1" name="paintings" /> <Link index="2" name="drawings" /> {(activeIndex == 1 || activeIndex == 3) && <Link index="3" name="info" />}
      <hr/>
      {(activeIndex == 0) && <Bio />}
      {(activeIndex == 1) && <Paintings />}
      {(activeIndex == 2) && <Drawings />}
      {(activeIndex == 3) && <Info />}
    </>
  )
}