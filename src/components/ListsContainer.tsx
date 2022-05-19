import React, { Component } from 'react'
import '../css/Lists.css';
import List from './Lists'
import Button from './Button'
import TextBox from './TextBox';
import { BudgetList } from '../helper/BudgetList';

type Props = {}

type State = { list: React.ReactElement[], totalPerList: Map<string, number>, total: number, next_id: number }

export default class ListsContainer extends Component<Props, State> {
    state: State = {
        list: [],
        totalPerList: new Map<string, number>(),
        total: 0,
        next_id: 0
    }

    generateNewList(): void {
        let newList: React.ReactElement[] = this.state.list;

        let name: string = (document.getElementById("list_name") as HTMLInputElement).value;

        newList.push(<List key={this.state.next_id}
            listID={this.state.next_id}
            listName={name}
            onTotal={this.total}/>);

        let newTotalList = this.state.totalPerList
        newTotalList.set(this.state.next_id.toString(), 0)

        this.setState({
            list: newList,
            totalPerList: newTotalList,
            total: this.state.total,
            next_id: this.state.next_id + 1
        });
        (document.getElementById("list_name") as HTMLInputElement).value = "";
        return;
    }

    total = (listID: number, money: number): void => {
        let newTotalList = this.state.totalPerList
        newTotalList.set(listID.toString(), money)

        let newTotal = 0;
        for (let entry of Array.from(newTotalList.entries())) {
            let key = entry[0], val = entry[1]
            newTotal += val
        }

        this.setState({
            list: this.state.list,
            totalPerList: newTotalList,
            total: newTotal,
            next_id: this.state.next_id
        })
    }

    render() {
        return (
            <div className="ListContainer">
                {
                    this.state.list.map((comp) => {
                        return comp
                    })
                }
                <TextBox id='list_name' placeholder='Enter new list name:' />
                <Button name={'new list'} onClick={() => {
                    this.generateNewList()
                }} />
                <div>Total: {this.state.total}</div>
            </div>
        )
    }
}