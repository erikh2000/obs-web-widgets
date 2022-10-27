export interface IReceiveSpeechCallback {
  (speech:string):void;
}

function _sendMessageToSubscribers(message:string, receiveSpeechCallbacks:(IReceiveSpeechCallback|null)[]) {
  receiveSpeechCallbacks.forEach(onReceiveSpeech => {
    if (onReceiveSpeech) onReceiveSpeech(message);
  });
}

class SpeechPipeReceiver {
  receiveSpeechCallbacks:(IReceiveSpeechCallback|null)[];
  isListening:boolean;
  listenTimeout:NodeJS.Timeout|null;
  stupidQueueUrl:string;
  
  private _listenForSpeech = () => {
    if (this.listenTimeout) { // Avoid starting 2 chains of setTimeout() calls. 
      clearTimeout(this.listenTimeout);
      this.listenTimeout = null;
    }
    
    fetch(this.stupidQueueUrl).then(response => {
      return response.json();
    }).then(messagesObject => {
      if (this.isListening) {
        const messages = messagesObject as string[];
        messages.forEach(message => _sendMessageToSubscribers(message, this.receiveSpeechCallbacks));
        this.listenTimeout = setTimeout(this._listenForSpeech, 0);
      }
    });
  }
  
  constructor(stupidQueueUrl:string) {
    this.receiveSpeechCallbacks = [];
    this.isListening = false;
    this.listenTimeout = null;
    this.stupidQueueUrl = stupidQueueUrl;
  }
  
  subscribe(onReceiveSpeech:IReceiveSpeechCallback):number {
    this.receiveSpeechCallbacks.push(onReceiveSpeech);
    return this.receiveSpeechCallbacks.length - 1;
  }
  
  unsubscribe(subscriptionId:number) {
    this.receiveSpeechCallbacks[subscriptionId] = null;
  }
  
  startListening() {
    this.isListening = true;
    this._listenForSpeech();
  }
  
  stopListening() {
    this.isListening = false;
  }
}

export default SpeechPipeReceiver;