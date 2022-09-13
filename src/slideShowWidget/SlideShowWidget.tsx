import GreenBackground from "common/GreenBackground";
import SlideDeck from "./SlideDeck";

import { useState, useEffect } from 'react';

interface IProps {
  slideDeck:SlideDeck  
}

const SlideShowWidget = (props:IProps) => {
  const [slideNo, setSlideNo] = useState<number>(0);

  const slides = props.slideDeck.slides;

  useEffect(() => {
    if (!slides.length) return;
    const nextSlideTimeout = setTimeout(() => {
      const nextSlideNo = (slideNo + 1) % slides.length;
      setSlideNo(nextSlideNo);
    }, 8000);
    return () => clearTimeout(nextSlideTimeout);
  }, [slideNo]);

  if (!slides.length) return null;
  const slide = slides[slideNo];
  
  return (
    <GreenBackground>
      {slide}
    </GreenBackground>);
}

export default SlideShowWidget;