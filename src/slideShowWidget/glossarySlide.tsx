import styles from './glossarySlide.module.css';

interface IProps {
  subject:string, 
  description:string
}

const GlossarySlide = (props:IProps) => {
  return (
    <div className={styles.container}>
      <h1>{props.subject}</h1>
      <p>{props.description}</p>
    </div>
  );
};

export default GlossarySlide;