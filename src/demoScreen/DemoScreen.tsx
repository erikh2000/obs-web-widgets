import React from 'react';
import SlideShowWidget from "slideShowWidget/SlideShowWidget";
import styles from './DemoScreen.module.css';
import { Spiel } from 'sl-spiel';

import { useEffect, useState } from 'react';

function _createSpiel() {
  const spiel = new Spiel();
  spiel.createNode();
  spiel.addDialogue('Refactoring: Improving the internal structure of code without changing what the code does.');
  spiel.createNode();
  spiel.addDialogue('Unit Test: Code that tests that a function returns expected values with specified inputs.');
  spiel.addRootReply('shut up', 'Hey, be nice!');
  return spiel;
}

function DemoScreen() {
  const [spiel, setSpiel] = useState<Spiel|null>(null);
  
  useEffect(() => {
    setSpiel(_createSpiel());
  }, []);
  
  if (!spiel) return null;
  
  return (
    <div className={styles.app}>
      <SlideShowWidget spiel={spiel}/>
    </div>
  );
}

export default DemoScreen;
