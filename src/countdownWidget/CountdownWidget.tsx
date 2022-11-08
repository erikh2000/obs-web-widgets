import GreenBackground from "common/GreenBackground";
import {MSECS_IN_SECOND, SECS_IN_MINUTE} from "common/util/timeConstants";
import styles from './CountdownWidget.module.css';

import { useState, useEffect } from 'react';
import { useLocation, Location } from 'react-router-dom';

function _concatDisplayText(remainingSeconds:number):string {
  if (remainingSeconds < 0) return ' 0:00';
  const minutes = Math.floor(remainingSeconds / SECS_IN_MINUTE);
  const seconds = remainingSeconds - (minutes * SECS_IN_MINUTE);
  return `${minutes < 10 ? ' ' : ''}${minutes}:${ seconds < 10 ? '0' : ''}${seconds}`;
}

function _getDurationFromLocation(location:Location):number {
  const params = new URLSearchParams(location.search);
  const duration = params.get('duration');
  if (!duration) return 0;
  return parseInt(duration);
}

const CountdownWidget = () => {
  const [displayText, setDisplayText] = useState<string>('');
  const [elapsedSecs, setElapsedSecs] = useState<number>(0);

  const location = useLocation();
  const duration = _getDurationFromLocation(location);

  useEffect(() => {
    setDisplayText(_concatDisplayText(duration - elapsedSecs));
  }, [duration, elapsedSecs]);

  useEffect(() => {
    const oneSecondTimeout = setTimeout(() => {
      setElapsedSecs(elapsedSecs + 1);
    }, MSECS_IN_SECOND);
    return () => clearTimeout(oneSecondTimeout);
  }, [elapsedSecs]);

  return (<GreenBackground>
    <p className={styles.container}>
      <span className={styles.letter}>{displayText[0]}</span>
      <span className={styles.letter}>{displayText[1]}</span>
      <span className={styles.letter}>{displayText[2]}</span>
      <span className={styles.letter}>{displayText[3]}</span>
      <span className={styles.letter}>{displayText[4]}</span>
    </p>
  </GreenBackground>);
}

export default CountdownWidget;