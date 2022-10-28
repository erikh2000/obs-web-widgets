import SpeechPipeReceiver, {IReceiveSpeechCallback} from "common/SpeechPipeReceiver";
import { Spiel, SpielNode, SpielReply } from 'sl-spiel';

export const CHANGE_SLIDE_INTERVAL = 3000;
const STUPID_QUEUE_URL = 'http://localhost:3001/receive';

export enum SlideState {
  UNINITIALIZED,
  WAITING_FOR_SLIDE_CHANGE,
  CHANGING_SLIDE
}

let speechPipeReceiver:SpeechPipeReceiver|null = null; // This is not correctly scoped if you want a shared instance. In that case, pass in the instance as a prop and let a containing component manage the instance.

type SubjectAndDescription = { subject:string, description:string }
function _parseSubjectAndDescriptionFromMessage(message:string):SubjectAndDescription {
  const fields = message.split(':');
  return fields.length >= 2
    ? { subject:fields[0].trim(), description:fields[1].trim() }
    : { subject:'', description:message.trim() };
}

export function startListeningForSpeech(onReceiveSpeech:IReceiveSpeechCallback) {
  if (speechPipeReceiver) speechPipeReceiver.stopListening();
  speechPipeReceiver = new SpeechPipeReceiver(STUPID_QUEUE_URL);
  speechPipeReceiver.subscribe(onReceiveSpeech);
  speechPipeReceiver.startListening();
} 

function _parseSubjectAndDescriptionFromNode(node:SpielNode):SubjectAndDescription {
  return _parseSubjectAndDescriptionFromMessage(node.nextDialogue());
}

function _parseSubjectAndDescriptionFromReply(reply:SpielReply):SubjectAndDescription {
  return _parseSubjectAndDescriptionFromMessage(reply.nextDialogue());
}

export function updateSubjectAndDescriptionFromNode(node:SpielNode|null, setSubject:any, setDescription:any) {
  if (!node) {
    setSubject('');
    setDescription('');
    return;
  }
  const next = _parseSubjectAndDescriptionFromNode(node);
  setSubject(next.subject);
  setDescription(next.description);
}

export function updateSubjectAndDescriptionFromReply(reply:SpielReply|null, setSubject:any, setDescription:any) {
  if (!reply) {
    setSubject('');
    setDescription('');
    return;
  }
  const next = _parseSubjectAndDescriptionFromReply(reply);
  setSubject(next.subject);
  setDescription(next.description);
}

export function onReceiveSpeech(message:string, spiel:Spiel, slideState:SlideState, setPendingReply:any, setSlideState:any) {
  if (slideState === SlideState.CHANGING_SLIDE) return; // Don't interrupt an in-progress slide change.
  const reply = spiel.checkForMatch(message);
  if (!reply) return;
  setPendingReply(reply);
  setSlideState(SlideState.CHANGING_SLIDE);
}
