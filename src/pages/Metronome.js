import { Component } from "react/cjs/react.production.min";

import * as MetronomeComponent from "../components/Metronome"
import BPMSlider from '../components/BPMSlider';
import { withRouter, neutralizeBack, restoreBack } from '../components/HistoryManager';

import './Metronome.css';

class Metronome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      tempo: 60,
      noteResolution: 2
    };

    MetronomeComponent.init( this.tempo, this.state.noteResolution );
  }

  componentDidMount() {
    neutralizeBack(() => {this.props.router.navigate("/")});
  }

  componentWillUnmount() {
    restoreBack();

    MetronomeComponent.stop();
  }

  togglePlay() {
    var playing = !this.state.playing

    this.setState({
      playing: playing,
      tempo: this.state.tempo,
      noteResolution: this.state.noteResolution
    })

    if (playing) {
      MetronomeComponent.start();
    } else {
      MetronomeComponent.stop();
    }
  }

  setTempo( value ) {
    this.setState({
      playing: this.state.playing,
      tempo: value,
      noteResolution: this.state.noteResolution
    });
    MetronomeComponent.setTempo( value );

    var bpm = document.getElementById("bpm");
    if (bpm != null) {
      bpm.value = value;
      bpm.innerHTML = value;
    }
  }

  setResolution( event ) {
    const r = parseInt(event.target.value);
    this.setState({
      playing: this.state.playing,
      tempo: this.state.tempo,
      noteResolution: r
    });
    MetronomeComponent.setResolution( r );
  }

  render() {
    var style = {width: 300, margin:50};

    return (
      <div>
        <button onClick={ () => this.props.router.navigate("/") }>Back</button>
        <div className="bpmslider-wrapper" style = {style}>
          <BPMSlider from={20} to={180} default={this.state.tempo} callback={this.setTempo.bind(this)} />
          <div className="note-resolution-container">
              <input 
                id="fourth"
                type="radio" 
                onChange={this.setResolution.bind(this)} 
                checked={this.state.noteResolution === 2} 
                value="2" />
                <label htmlFor="fourth">4th</label>
              <input 
                id="eight"
                type="radio" 
                onChange={this.setResolution.bind(this)} 
                checked={this.state.noteResolution === 1} 
                value="1" />
                <label htmlFor="eight">8th</label>
              <input 
                id="sixteenth"
                type="radio" 
                onChange={this.setResolution.bind(this)} 
                checked={this.state.noteResolution === 0} 
                value="0" />
                <label htmlFor="sixteenth">16th</label>
          </div>
        </div>
        <button id="playpause" onClick={this.togglePlay.bind(this)}>
            {this.state.playing ? "Stop" : "Start"}
        </button>
      </div>
    );
  }
}

export default withRouter(Metronome);
