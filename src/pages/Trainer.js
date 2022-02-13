import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createUseStyles } from 'react-jss';

import { neutralizeBack, restoreBack } from '../components/HistoryManager';
import * as MetronomeComponent from "../components/Metronome"
import Timer from '../components/Timer';

const useStyles = createUseStyles({
  wrapper: {
  }
});

export default function Trainer() {
  const [input_bpm, setBPM] = useState("60");
  const [input_increment, setIncrement] = useState("5");
  const [input_duration, setDuration] = useState("5");
  const navigate = useNavigate();
  const classes = useStyles();

  const timer = useRef("Timer");

  useEffect(() => {
    MetronomeComponent.init( 60, 2 );
    neutralizeBack(() => {navigate("/")});
    return () => {
      MetronomeComponent.stop();
      restoreBack();
    };
  });

  function startTraining(bpm, increment, duration, i, repeats) {
    MetronomeComponent.setTempo(bpm);
    MetronomeComponent.start();
    
    if (i < repeats) {
      const trainingCallback = () => {
        MetronomeComponent.stop();
        startTraining(
          bpm+increment, 
          increment, 
          duration, 
          i+1, 
          repeats
        );
      };
      timer.current.startCountdownToCallback(duration, trainingCallback);
    } else {
      timer.current.startCountdownToCallback(duration, MetronomeComponent.stop);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    startTraining(parseInt(input_bpm), parseInt(input_increment), parseInt(input_duration), 1, 5);
  }

  return (
    <div className={classes.wrapper}>
      <button onClick={ () => navigate("/") }>Back</button>
      <form onSubmit={handleSubmit}>
        <label>
          BPM:
          <input type="number" name="input_bpm" onChange={(e) => {setBPM(e.target.value)}} value={input_bpm} />
        </label>
        <label>
          Increment:
          <input type="number" name="input_increment" onChange={(e) => {setIncrement(e.target.value)}} value={input_increment} />
        </label>
        <label>
          Seconds:
          <input type="number" name="input_duration" onChange={(e) => {setDuration(e.target.value)}} value={input_duration} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <Timer ref={timer}/>
    </div>
  )
}
