import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import Metronome from './pages/Metronome';
import './App.css';


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
        <div className="App">
          <Routes>
            <Route exact path='/' element={<Menu />} />
            <Route path='/metronome' element={<Metronome />} />
          </Routes>
        </div>
      );
    }
  }
}

export default App;
