import GreenBackground from "common/GreenBackground";
import {MSECS_IN_MINUTE} from "common/util/timeConstants";
import styles from './TitleWidget.module.css';

import { useState, useEffect } from 'react';
import { useLocation, Location } from 'react-router-dom';

function _concatTitleText(sessionName:string|null):string {
  let dateText = new Date().toLocaleDateString('en-US', {dateStyle:'long'});
  return sessionName ? `${dateText} - ${sessionName}` : `${dateText}`;
}

function _getSessionNameFromLocation(location:Location):string|null {
  const params = new URLSearchParams(location.search);
  return params.get('sessionName');
}

const TitleWidget = () => {
  const [titleText, setTitleText] = useState<string|null>(null);
  const [frameNo, setFrameNo] = useState<number>(0);
  
  const location = useLocation();
  const sessionName = _getSessionNameFromLocation(location);
  
  useEffect(() => {
    setTitleText( _concatTitleText(sessionName));
  }, [sessionName, frameNo]);
  
  useEffect(() => {
    const checkAgainTimeout = setTimeout(() => {
      setFrameNo(frameNo + 1);
    }, MSECS_IN_MINUTE);
    return () => clearTimeout(checkAgainTimeout);
  }, [frameNo]);
  
  return (<GreenBackground>
    <p className={styles.container}>{titleText}</p>
  </GreenBackground>);
}

export default TitleWidget;