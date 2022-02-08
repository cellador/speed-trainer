import React, { Component } from 'react';
import './App.css';
import Metronome from './Metronome';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = { loading: true };
  }

  componentDidMount () {
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return(
        <div>loading...</div>
      );
    }
    else {
      return(
        <Metronome />
      );
    }
  }
}

//   constructor(props) {
//     super(props);

//     this.state = {
//       playing: false
//     };

//     this.click = new Audio(click);
//   }

//   startStop = () => {    
//     const newAudio = this.click.cloneNode()
//     newAudio.play()
//   }

//   render() {
//     const { playing } = this.state;

//     return (
//       <div className="App">
//         <button onClick={this.startStop}>
//           Play
//         </button>
//       </div>
//     );
//   }
// }

export default App;
