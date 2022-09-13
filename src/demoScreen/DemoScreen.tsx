import React from 'react';
import SlideShowWidget from "slideShowWidget/SlideShowWidget";
import SlideDeck from "slideShowWidget/SlideDeck";
import GlossarySlide from "../slideShowWidget/glossarySlide";

import { useEffect, useState } from 'react';

function _createSlideDeck() {
  const slideDeck = new SlideDeck();
  slideDeck.add((<GlossarySlide subject='Refactoring' description='Improving the internal structure of code without changing what the code does.'/>));
  slideDeck.add((<GlossarySlide subject='Unit Test' description='Code that tests that a function returns expected values with specified inputs.'/>));
  return slideDeck;
}

function App() {
  const [slideDeck, setSlideDeck] = useState<SlideDeck|null>(null);
  
  useEffect(() => {
    setSlideDeck(_createSlideDeck());
  }, []);
  
  if (!slideDeck) return null;
  
  return (
    <div className="App">
      <SlideShowWidget slideDeck={slideDeck}/>
    </div>
  );
}

export default App;
