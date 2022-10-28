import GreenBackground from "common/GreenBackground";
import SpeechPipeReceiver from "common/SpeechPipeReceiver";
import Slide from "slideShowWidget/Slide";
import { Spiel, SpielNode, SpielReply } from 'sl-spiel';

import {useState, useEffect} from 'react';

const CHANGE_SLIDE_INTERVAL = 3000;
const STUPID_QUEUE_URL = 'http://localhost:3001/receive';
let speechPipeReceiver:SpeechPipeReceiver|null = null; // This is not correctly scoped if you want a shared instance. In that case, pass in the instance as a prop and let a containing component manage the instance.

type SubjectAndDescription = { subject:string, description:string }
function _parseSubjectAndDescriptionFromMessage(message:string):SubjectAndDescription {
  const fields = message.split(':');
  return fields.length >= 2
    ? { subject:fields[0].trim(), description:fields[1].trim() }
    : { subject:'', description:message.trim() };
}

function _parseSubjectAndDescriptionFromNode(node:SpielNode):SubjectAndDescription {
  return _parseSubjectAndDescriptionFromMessage(node.nextDialogue());
}

function _parseSubjectAndDescriptionFromReply(reply:SpielReply):SubjectAndDescription {
  return _parseSubjectAndDescriptionFromMessage(reply.nextDialogue());
}

function _updateSubjectAndDescriptionFromNode(node:SpielNode|null, setSubject:any, setDescription:any) {
  if (!node) {
    setSubject('');
    setDescription('');
    return;
  }
  const next = _parseSubjectAndDescriptionFromNode(node);
  setSubject(next.subject);
  setDescription(next.description);
}

function _updateSubjectAndDescriptionFromReply(reply:SpielReply|null, setSubject:any, setDescription:any) {
  if (!reply) {
    setSubject('');
    setDescription('');
    return;
  }
  const next = _parseSubjectAndDescriptionFromReply(reply);
  setSubject(next.subject);
  setDescription(next.description);
}

function _onReceiveSpeech(message:string, spiel:Spiel, slideState:SlideState, setPendingReply:any, setSlideState:any) {
  if (slideState === SlideState.CHANGING_SLIDE) return; // Don't interrupt an in-progress slide change.
  const reply = spiel.checkForMatch(message);
  if (!reply) return;
  setPendingReply(reply);
  setSlideState(SlideState.CHANGING_SLIDE);
}

enum SlideState {
  UNINITIALIZED,
  WAITING_FOR_SLIDE_CHANGE,
  CHANGING_SLIDE
}

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
        if (!speechPipeReceiver) {
          speechPipeReceiver = new SpeechPipeReceiver(STUPID_QUEUE_URL);
          speechPipeReceiver.subscribe((message) => _onReceiveSpeech(message, spiel, slideState, setPendingReply, setSlideState));
          speechPipeReceiver.startListening();
        }
        _updateSubjectAndDescriptionFromNode(spiel.currentNode, setSubject, setDescription);
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
            _updateSubjectAndDescriptionFromReply(pendingReply, setSubject, setDescription);
            setPendingReply(null);
          } else {
            spiel.moveNextLooped();
            _updateSubjectAndDescriptionFromNode(spiel.currentNode, setSubject, setDescription);
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