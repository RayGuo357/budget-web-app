import React from 'react';
import '../css/App.css';
import Button from './Button';
import ListsContainer from './ListsContainer';
import ChartContainer from './ChartContainer';

function App() {
  return (
    <div className="App">
      <ListsContainer />
      <ChartContainer />
    </div>
  );
}

export default App;
