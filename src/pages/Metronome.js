import { Component } from "react/cjs/react.production.min";
import * as MetronomeComponent from "../components/metronome"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const { Handle } = Slider;

class Metronome extends Component {
    constructor(props) {
        super(props);

        this.tempo = 60;
        this.noteResolution = 2;
        this.playing = false;

        MetronomeComponent.init( this.tempo, this.noteResolution );
    }

    togglePlay() {
        this.playing = !this.playing

        var btn = document.getElementById("playpause");
        btn.value = this.playing ? "Pause" : "Play";
        btn.innerHTML = btn.value;

        MetronomeComponent.togglePlay();
    }

    render() {
        var style = {width:400,margin:50};
        var handle = props => {
            const { value, dragging, index, ...restProps } = props;

            this.tempo = value;

            MetronomeComponent.setTempo( this.tempo );

            var bpm = document.getElementById("bpm");
            if (bpm != null) {
                bpm.value = this.tempo;
                bpm.innerHTML = this.tempo;
            }

            return(<Handle value={props.value} {...restProps} />)
        };

        return (
            <div>
                <h1 id="bpm">{this.tempo}</h1>
                <div style = {style}>
                    <Slider defaultValue={this.tempo} min={1} max={240} handle={handle}/>
                </div>
                <button id="playpause" onClick={this.togglePlay.bind(this)}>
                    Play
                </button>
            </div>
        );
    }
}

export default Metronome;
