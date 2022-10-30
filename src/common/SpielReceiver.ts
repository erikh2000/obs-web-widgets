import { Spiel, importSpielFile } from 'sl-spiel';

export interface ISpielCallback {
  (spiel:Spiel):void
}

const REFRESH_SPIEL_INTERVAL = 3000;

async function _fetchSpielText(url:string):Promise<string|null> {
  const response = await fetch(url);
  if (response.status === 304) return null; // No change.
  if (response.status !== 200) throw Error(`Failed to fetch messages - HTTP status ${response.status}`);
  return await response.text();
}

class SpielReceiver {
  spielFileUrl:string;
  isListening:boolean;
  listenTimeout:NodeJS.Timeout|null;
  onNewSpiel:ISpielCallback;
  lastSpielText:string;

  constructor(spielFileUrl:string, onNewSpiel:ISpielCallback) {
    this.spielFileUrl = spielFileUrl;
    this.isListening = false;
    this.listenTimeout = null;
    this.onNewSpiel = onNewSpiel;
    this.lastSpielText = '';
  }
  
  private _listenForSpielChange = () => {
    if (this.listenTimeout) { // Avoid starting 2 chains of setTimeout() calls. 
      clearTimeout(this.listenTimeout);
      this.listenTimeout = null;
    }

    try {
      _fetchSpielText(this.spielFileUrl)
        .then((spielText:string|null) => {
          if (spielText && spielText !== this.lastSpielText) {
            this.lastSpielText = spielText;
            this.onNewSpiel(importSpielFile(spielText));
            if (this.isListening) this.listenTimeout = setTimeout(this._listenForSpielChange, REFRESH_SPIEL_INTERVAL);
          }
        });
    } catch(error) {
      console.error(error);
      this.isListening = false;
    }
  }
    
  startListening() {
    this.isListening = true;
    this._listenForSpielChange();
  }
  
  stopListening() {
    this.isListening = false;
  }
  
}

export default SpielReceiver;