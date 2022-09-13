class SlideDeck {
  slides:JSX.Element[] = [];
  
  add(slide:JSX.Element) {
    this.slides.push(slide);
  }
  
  clear() {
    this.slides = [];
  }
}

export default SlideDeck;