import { Component } from "react/cjs/react.production.min";

import * as MetronomeComponent from "../components/metronome"
import BPMSlider from '../components/BPMSlider';
import { withRouter, neutralizeBack, restoreBack } from '../components/HistoryManager';

class Metronome extends Component {
    constructor(props) {
        super(props);

        this.tempo = 60;
        this.playing = false;

        this.state = {
            noteResolution: 2
        };

        MetronomeComponent.init( this.tempo, this.state.noteResolution );
    }

    componentDidMount() {
      neutralizeBack(() => {this.props.router.navigate("/")});
    }

    componentWillUnmount() {
      restoreBack();
    }

    togglePlay() {
        this.playing = !this.playing

        var btn = document.getElementById("playpause");
        btn.value = this.playing ? "Pause" : "Play";
        btn.innerHTML = btn.value;

        MetronomeComponent.togglePlay();
    }

    setTempo( value ) {
        this.tempo = value;

        MetronomeComponent.setTempo( this.tempo );

        var bpm = document.getElementById("bpm");
        if (bpm != null) {
            bpm.value = this.tempo;
            bpm.innerHTML = this.tempo;
        }
    }

    setResolution( event ) {
        const r = parseInt(event.target.value);
        this.setState({
            noteResolution: r
        });
        MetronomeComponent.setResolution( r );
    }

    render() {
        var style = {width: 300, margin:50};

        return (
            <div>
                <button onClick={ () => this.props.router.navigate("/") }>Back</button>
                <div style = {style}>
                    <BPMSlider from={20} to={180} default={this.tempo} callback={this.setTempo.bind(this)} />
                </div>
                <div>
                    <input type="radio" onChange={this.setResolution.bind(this)} checked={this.state.noteResolution === 2} value="2" name="fourth" /> 4th
                    <input type="radio" onChange={this.setResolution.bind(this)} checked={this.state.noteResolution === 1} value="1" name="eight" /> 8th
                    <input type="radio" onChange={this.setResolution.bind(this)} checked={this.state.noteResolution === 0} value="0" name="sixteenth" /> 16th
                </div>
                <button id="playpause" onClick={this.togglePlay.bind(this)}>
                    Play
                </button>
            </div>
        );
    }
}

export default withRouter(Metronome);
