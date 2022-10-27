import styles from './Slide.module.css';

interface IProps {
  isChanging:boolean,
  subject:string,
  description:string
}

const Slide = (props:IProps) => {
  const { isChanging, subject, description } = props;
  const containerClasses = isChanging ? `${styles.container} ${styles.changeSlide}` : styles.container;
  return (
    <div className={containerClasses}>
      <h1>{isChanging ? '' : subject}</h1>
      <p>{isChanging ? '' : description}</p>
    </div>
  );
};

export default Slide;