export interface IReceiveSpeechCallback {
  (speech:string):void;
}

function _sendMessageToSubscribers(message:string, receiveSpeechCallbacks:(IReceiveSpeechCallback|null)[]) {
  receiveSpeechCallbacks.forEach(onReceiveSpeech => {
    if (onReceiveSpeech) onReceiveSpeech(message);
  });
}

async function _fetchMessages(url:string):Promise<string[]> {
  const response = await fetch(url);
  if (response.status !== 200) throw Error(`Failed to fetch messages - HTTP status ${response.status}`);
  const messagesObject = await response.json();
  if (!Array.isArray(messagesObject) || 
    (messagesObject.length && typeof(messagesObject[0] !== 'string'))) {
    throw Error(`Unexpected response format - ${JSON.stringify(messagesObject)}`);
  }
  return messagesObject as string[];
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
    
    try {
      _fetchMessages(this.stupidQueueUrl)
        .then(messages => {
          if (this.isListening) {
            messages.forEach(message => _sendMessageToSubscribers(message, this.receiveSpeechCallbacks));
            this.listenTimeout = setTimeout(this._listenForSpeech, 0);
          }    
        });
    } catch(error) {
      console.error(error);
      this.isListening = false;
    }
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