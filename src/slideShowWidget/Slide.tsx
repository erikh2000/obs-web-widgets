import styles from './Slide.module.css';
import ISlide from "slideShowWidget/ISlide";

interface IProps {
  isChanging:boolean,
  slide:ISlide
}

const Slide = (props:IProps) => {
  const { isChanging, slide } = props;
  const containerClasses = isChanging ? `${styles.container} ${styles.changeSlide}` : styles.container;
  return (
    <div className={containerClasses}>
      <h1>{isChanging ? '' : slide.subject}</h1>
      <p>{isChanging ? '' : slide.description}</p>
    </div>
  );
};

export default Slide;