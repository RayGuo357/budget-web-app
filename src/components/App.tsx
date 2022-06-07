import React, { Component } from 'react';
import '../css/App.css';
import ListsContainer from './ListsContainer';
import ChartContainer from './ChartContainer';

type Props = {}

type State = { listContainer: React.RefObject<ListsContainer>, chartContainer: React.RefObject<any>}

class App extends Component<Props, State> {
  state: State = {
    listContainer: React.createRef() as React.RefObject<ListsContainer>,
    chartContainer: React.createRef() as React.RefObject<any>
  }
  
  render() {
    return (
      <div className="App">
        <ListsContainer 
          ref={this.state.listContainer} 
          refToChart={this.state.chartContainer}/>
        <ChartContainer ref={this.state.chartContainer} />
      </div>
    )
  }
}

export default App;
