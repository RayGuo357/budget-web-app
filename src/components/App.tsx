import React from 'react';
import logo from '../icons/logo.svg';
import '../css/App.css';
import { BudgetList, Items } from '../helper/BudgetList';
import Button from './Button';

const createNewList = (name: string, bool: boolean, items: Items[] = []) => {
  let x = new BudgetList(name, bool, items)
}

function App() {
  return (
    <div className="App">
        <Button name={"Test"} onClick={() => {
          createNewList("Test", false)
        }}></Button>
    </div>
  );
}

export default App;
