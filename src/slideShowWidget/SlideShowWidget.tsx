import GreenBackground from "common/GreenBackground";
import Slide from "slideShowWidget/Slide";
import {
  CHANGE_SLIDE_INTERVAL,
  onReceiveSpeech,
  SlideState,
  startListeningForSpeech,
  updateSubjectAndDescriptionFromNode,
  updateSubjectAndDescriptionFromReply
} from 'slideShowWidget/SlideShowWidgetInteractions';
import {Spiel, SpielReply} from 'sl-spiel';

import {useEffect, useState} from 'react';

const POP_ANIMATION_DURATION = 1000; // Coupled to CSS animation-duration value.

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
        startListeningForSpeech(
          (message) => onReceiveSpeech(message, spiel, slideState, setPendingReply, setSlideState)
          );
        updateSubjectAndDescriptionFromNode(spiel.currentNode, setSubject, setDescription);
        setSlideState(SlideState.POPPING_IN);
        break;

      case SlideState.POPPING_IN:
        const completeFirstAnimationTimeout = setTimeout(() => {
          setSlideState(SlideState.WAITING_FOR_SLIDE_CHANGE);
        }, POP_ANIMATION_DURATION);
        return () => clearTimeout(completeFirstAnimationTimeout);
        
      case SlideState.WAITING_FOR_SLIDE_CHANGE:
        const nextSlideTimeout = setTimeout(() => {
          setSlideState(SlideState.POPPING_OUT);
        }, CHANGE_SLIDE_INTERVAL);
        return () => clearTimeout(nextSlideTimeout);
        
      case SlideState.POPPING_OUT:
        const completeAnimationTimeout = setTimeout(() => {
          if (pendingReply) {
            updateSubjectAndDescriptionFromReply(pendingReply, setSubject, setDescription);
            setPendingReply(null);
          } else {
            spiel.moveNextLooped();
            updateSubjectAndDescriptionFromNode(spiel.currentNode, setSubject, setDescription);
          }
          setSlideState(SlideState.POPPING_IN);
        }, POP_ANIMATION_DURATION);
        return () => clearTimeout(completeAnimationTimeout);
    }
  }, [slideState, spiel, pendingReply]);
  
  if (!spiel.currentNode) return null;
  
  return (
    <GreenBackground>
      <Slide slideState={slideState} subject={subject} description={description} />
    </GreenBackground>);
}

export default SlideShowWidget;