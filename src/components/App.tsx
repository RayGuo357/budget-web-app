import React from 'react';
import logo from '../icons/logo.svg';
import '../css/App.css';
import Button from './Button';
import ListsContainer from './ListsContainer';
import Chart from './Chart';

function App() {
  return (
    <div className="App">
      <ListsContainer />
      <Chart />
    </div>
  );
}

export default App;
