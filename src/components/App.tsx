import React, { Component } from 'react';
import '../css/App.css';
import ListsContainer from './ListsContainer';
import ChartContainer from './ChartContainer';

type Props = {}

type State = { listContainer: React.RefObject<ListsContainer>, chartContainer: React.RefObject<any> }

class App extends Component<Props, State> {
  state: State = {
    listContainer: React.createRef() as React.RefObject<ListsContainer>,
    chartContainer: React.createRef() as React.RefObject<any>
  }

  render() {
    return (
      <div className="App">
        <div id='list_container_holder'>
          <ListsContainer
            ref={this.state.listContainer}
            refToChart={this.state.chartContainer} />
        </div>
        <div id='chart_container_holder'>
          <ChartContainer ref={this.state.chartContainer} />
        </div>
      </div>
    )
  }
}

export default App;
