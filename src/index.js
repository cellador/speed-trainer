import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom'
import './App.css';
import App from './App';

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  </React.StrictMode>,
  rootElement
);
