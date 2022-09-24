import GreenBackground from "common/GreenBackground";
import SlideDeck from "slideShowWidget/SlideDeck";
import Slide from "slideShowWidget/Slide";

import {useState, useEffect} from 'react';

interface IProps {
  slideDeck:SlideDeck  
}

const SlideShowWidget = (props:IProps) => {
  const [slideNo, setSlideNo] = useState<number>(0);
  const [isSlideChanging, setSlideChanging] = useState<boolean>(false);

  const slides = props.slideDeck.slides;

  useEffect(() => {
    if (!slides.length) return;
    const nextSlideTimeout = setTimeout(() => {
      const nextSlideNo = (slideNo + 1) % slides.length;
      setSlideNo(nextSlideNo);
      setSlideChanging(true);
    }, 8000);
    return () => clearTimeout(nextSlideTimeout);
  }, [slideNo, slides]);
  
  useEffect(() => {
    if (!isSlideChanging) return;
    const ANIMATION_MSECS = 100; // Coupled to CSS animation-duration values.
    const completeAnimationTimeout = setTimeout(() => {
      setSlideChanging(false);
    }, ANIMATION_MSECS);
    return () => clearTimeout(completeAnimationTimeout);
  }, [isSlideChanging])

  if (!slides.length) return null;
  
  return (
    <GreenBackground>
      <Slide isChanging={isSlideChanging} slide={slides[slideNo]} />
    </GreenBackground>);
}

export default SlideShowWidget;