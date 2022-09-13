import styles from "./GreenBackground.module.css";
import {PropsWithChildren} from "react";

interface IProps { }

const GreenBackground = (props:PropsWithChildren<IProps>) => {
  return <div className={styles.container}>{props.children}</div>;
}

export default GreenBackground;