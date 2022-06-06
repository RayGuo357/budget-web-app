import React, { Component } from 'react'
import '../css/Lists.css';
import List from './Lists'
import Button from './Button'
import TextBox from './TextBox';
import { getTodaysDate, getCircularReplacer } from '../helper/helperFunc'
import { BudgetList } from '../helper/BudgetList'

type Props = {}

type State = { list: React.ReactElement[], totalPerList: Map<string, number>, refPerList: Map<string, React.RefObject<List>>, total: number, next_id: number }

// Holds the different lists as well as manages over all of them
export default class ListsContainer extends Component<Props, State> {
    state: State = {
        list: [],
        totalPerList: new Map<string, number>(),
        refPerList: new Map<string, React.RefObject<List>>(),
        total: 0,
        next_id: 0
    }

    generateNewList(name: string): void {
        // Initialize copy of current list
        let newList: React.ReactElement[] = this.state.list;

        // Initialize copy of ref and create reference to child List
        let refPerList: Map<string, React.RefObject<List>> = this.state.refPerList
        let ref: React.RefObject<List> = React.createRef() as React.RefObject<List>
        refPerList.set(this.state.next_id.toString(), ref)

        // Updates state with the new reference
        this.setState({
            list: this.state.list,
            totalPerList: this.state.totalPerList,
            refPerList: refPerList,
            total: this.state.total,
            next_id: this.state.next_id
        })

        // Add the new list to the copy
        newList.push(<List key={this.state.next_id}
            ref={ref}
            listID={this.state.next_id}
            listName={name}
            onTotal={this.total} />);

        // Initializes total for the new list
        let newTotalList: Map<string, number> = this.state.totalPerList
        newTotalList.set(this.state.next_id.toString(), 0)

        // Finalize updated state and increments next id
        this.setState({
            list: newList,
            totalPerList: newTotalList,
            refPerList: this.state.refPerList,
            total: this.state.total,
            next_id: this.state.next_id + 1
        });

        // Clears input
        (document.getElementById("list_name") as HTMLInputElement).value = "";
        return;
    }

    // Used by the child components to total their items
    total(listID: number, money: number): void {
        let newTotalList: Map<string, number> = this.state.totalPerList
        newTotalList.set(listID.toString(), money)

        let newTotal = 0;
        for (let entry of Array.from(newTotalList.entries())) {
            let key: string = entry[0], val: number = entry[1]
            newTotal += val
        }

        this.setState({
            list: this.state.list,
            totalPerList: newTotalList,
            refPerList: this.state.refPerList,
            total: newTotal,
            next_id: this.state.next_id
        })
    }

    // Load from JSON file
    loadJSON(): void {

    }

    // API call to server to save as JSON
    saveAsJSON(): void {
        // Creates body to send with API call
        let date: string = getTodaysDate()
        let listData: any = []
        this.state.refPerList.forEach((e) => {
            console.log(e)
            listData.push(e.current!.state)
        })
        let data: {} = {
            'totalPerList': Object.fromEntries(this.state.totalPerList),
            'refPerList': listData,
            'date': date
        }

        console.log(JSON.stringify(data))

        // Makes the POST call
        fetch('http://192.168.0.114:6464/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((res) => {
                // TODO: Status check
                console.log(res);
            });
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
                    this.generateNewList((document.getElementById("list_name") as HTMLInputElement).value)
                }} />
                <div>Total: {this.state.total}</div>
                <div>Today is: {getTodaysDate()}</div>
                <Button name={'save'} onClick={() => {
                    this.saveAsJSON()
                }} />
                <Button name={'test'} onClick={() => {
                    console.log(this.state)
                }} />
                <Button name={'add all'} onClick={() => {
                    this.state.refPerList.forEach((e) => {
                        e.current?.generateNewItem(0, 0, 'test')
                    })
                }}/>
            </div>
        )
    }
}