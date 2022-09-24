import ISlide from 'slideShowWidget/ISlide';

class SlideDeck {
  slides:ISlide[] = [];
  
  add(subject:string, description:string) {
    this.slides.push({subject, description});
  }
  
  clear() {
    this.slides = [];
  }
}

export default SlideDeck;