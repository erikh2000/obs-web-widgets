import styles from './Slide.module.css';
import {SlideState} from "slideShowWidget/SlideShowWidgetInteractions";

interface IProps {
  slideState:SlideState
  subject:string,
  description:string
}

const Slide = (props:IProps) => {
  const { slideState, subject, description } = props;
  const isSpeaking = !subject || !subject.length;
  const containerClasses = slideState === SlideState.POPPING_OUT
    ? `${styles.container} ${styles.changeSlide}` 
    : styles.container;
  const mouthImage = isSpeaking ? <span className={styles.mouth}>&nbsp;</span> : null;
  const hideText = slideState !== SlideState.WAITING_FOR_SLIDE_CHANGE;
  
  return (
    <div className={containerClasses}>
      <h1>{hideText ? '' : subject}</h1>
      <div className={styles.descriptionPane}>
        {mouthImage}
        <span className={styles.description} hidden={hideText}>{description}</span>
      </div>
    </div>
  );
};

export default Slide;