//Credit: epascarello (https://stackoverflow.com/users/14104/epascarello)
//Source: https://stackoverflow.com/a/64228857

import { Component } from 'react'

class Timer extends Component {
  constructor(props) {
    super(props);
    this.timer = null;

    this.countdown = ("from" in props);

    this.state = {
      ...(this.countdown && {duration: props.from * 60 * 1000}),
      time: this.#msToTime(this.countdown ? props.from * 60 * 1000 : 0),
      pause: false,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startOrResume() {
    if (!this.timer) {
      if(!this.state.pause) {
        // begin
        this.setState(() => ({
          startTime: Date.now()
        }));
      } else {
        // resume
        const startTime = this.state.startTime + (Date.now() - this.state.beginPauseTime);
  
        this.setState(() => ({
          startTime: startTime,
          pause: false,
          beginPauseTime: null,
        }));
      }

      this.timer = window.setInterval(() => this.#run(), 10);
    }
  }

  pause() {
    if (this.timer && !this.state.pause) {
      this.stop();
      this.setState(() => ({
        pause: true,
        beginPauseTime: Date.now()
      }));
    }
  }

  stop() {
    window.clearInterval(this.timer);
    this.timer = null;
  }

  reset() {
    this.stop();
    this.setState(() => ({
      time: this.#msToTime(this.countdown ? this.state.duration : 0),
      pause: false,
    }));
  }

  startCountdownToCallback(time, callback) {
    this.countdown = true;
    this.setState({
      callback: callback,
      duration: time * 1000,
    });
    this.reset();
    this.startOrResume();
  }

  #msToTime(duration) {
    let milliseconds = parseInt((duration % 1000));
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    milliseconds = milliseconds.toString().padStart(3, '0');

    return {
      hours,
      minutes,
      seconds,
      milliseconds
    };
  }

  #run() {
    const diff = Date.now() - this.state.startTime;
    
    if (this.countdown)
    {
      // count down
      let remaining = this.state.duration - diff;
      if (remaining < 0) {
        remaining = 0;
      }
      this.setState(() => ({
        time: this.#msToTime(remaining)
      }));
      if (remaining === 0) {
        this.stop();
        if (this.state.callback) {
          this.state.callback();
        }
      }
    } else {
      // count up
      this.setState(() => ({
        time: this.#msToTime(diff)
      }));
    }
  }

  render() {
    return (
      <div>
        {
          this.state.time.hours
        }:{
          this.state.time.minutes
        }:{
          this.state.time.seconds
        }.{
          this.state.time.milliseconds
        }
      </div>
    );
  }
}

export default Timer;