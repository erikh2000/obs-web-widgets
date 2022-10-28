import GreenBackground from "common/GreenBackground";
import Slide from "slideShowWidget/Slide";
import {
  CHANGE_SLIDE_INTERVAL,
  onReceiveSpeech,
  startListeningForSpeech,
  updateSubjectAndDescriptionFromNode,
  updateSubjectAndDescriptionFromReply,
  SlideState
} from 'slideShowWidget/SlideShowWidgetInteractions';
import { Spiel, SpielReply } from 'sl-spiel';

import {useState, useEffect} from 'react';

interface IProps {
  spiel:Spiel
}

const SlideShowWidget = (props:IProps) => {
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [pendingReply, setPendingReply] = useState<SpielReply|null>(null);
  const [slideState, setSlideState] = useState<SlideState>(SlideState.UNINITIALIZED);
  const { spiel } = props;
  
  useEffect(() => {
    switch(slideState) {
      case SlideState.UNINITIALIZED:
        startListeningForSpeech((message) => onReceiveSpeech(message, spiel, slideState, setPendingReply, setSlideState));
        updateSubjectAndDescriptionFromNode(spiel.currentNode, setSubject, setDescription);
        setSlideState(SlideState.WAITING_FOR_SLIDE_CHANGE);
        break;
        
      case SlideState.WAITING_FOR_SLIDE_CHANGE:
        const nextSlideTimeout = setTimeout(() => {
          setSlideState(SlideState.CHANGING_SLIDE);
        }, CHANGE_SLIDE_INTERVAL);
        return () => clearTimeout(nextSlideTimeout);
        
      case SlideState.CHANGING_SLIDE:
        const POP_ANIMATION_DURATION = 100; // Coupled to CSS animation-duration value.
        const completeAnimationTimeout = setTimeout(() => {
          if (pendingReply) {
            updateSubjectAndDescriptionFromReply(pendingReply, setSubject, setDescription);
            setPendingReply(null);
          } else {
            spiel.moveNextLooped();
            updateSubjectAndDescriptionFromNode(spiel.currentNode, setSubject, setDescription);
          }
          setSlideState(SlideState.WAITING_FOR_SLIDE_CHANGE);
        }, POP_ANIMATION_DURATION);
        return () => clearTimeout(completeAnimationTimeout);
    }
  }, [slideState, spiel, pendingReply]);
  
  if (!spiel.currentNode) return null;
  
  const isSlideChanging = slideState === SlideState.CHANGING_SLIDE; 
  return (
    <GreenBackground>
      <Slide isChanging={isSlideChanging} subject={subject} description={description} />
    </GreenBackground>);
}

export default SlideShowWidget;