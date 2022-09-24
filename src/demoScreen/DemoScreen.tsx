import React from 'react';
import SlideShowWidget from "slideShowWidget/SlideShowWidget";
import SlideDeck from "slideShowWidget/SlideDeck";
import styles from './DemoScreen.module.css';

import { useEffect, useState } from 'react';

function _createSlideDeck() {
  const slideDeck = new SlideDeck();
  slideDeck.add('Refactoring', 'Improving the internal structure of code without changing what the code does.');
  slideDeck.add('Unit Test', 'Code that tests that a function returns expected values with specified inputs.');
  return slideDeck;
}

function DemoScreen() {
  const [slideDeck, setSlideDeck] = useState<SlideDeck|null>(null);
  
  useEffect(() => {
    setSlideDeck(_createSlideDeck());
  }, []);
  
  if (!slideDeck) return null;
  
  return (
    <div className={styles.app}>
      <SlideShowWidget slideDeck={slideDeck}/>
    </div>
  );
}

export default DemoScreen;
