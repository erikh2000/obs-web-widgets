import React from 'react';
import SlideShowWidget from "slideShowWidget/SlideShowWidget";
import styles from './DemoScreen.module.css';
import { Spiel } from 'sl-spiel';
import SpielReceiver from "common/SpielReceiver";

import { useEffect, useState } from 'react';

const SPIEL_URL = 'http://localhost:3000/obs-web-widgets/spiels/default.yml';
let spielReceiver:SpielReceiver|null = null;

function DemoScreen() {
  const [spiel, setSpiel] = useState<Spiel|null>(null);
  
  useEffect(() => {
    if (spielReceiver) return;
    spielReceiver = new SpielReceiver(SPIEL_URL, setSpiel);
    spielReceiver.startListening();
  }, []);
  
  if (!spiel) return null;
  
  return (
    <div className={styles.app}>
      <SlideShowWidget spiel={spiel}/>
    </div>
  );
}

export default DemoScreen;
