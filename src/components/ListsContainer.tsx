import React, { Component } from 'react'
import '../css/Lists.css';
import List from './Lists'
import Button from './Button'
import TextBox from './TextBox';
import { getTodaysDate, API, sleep } from '../helper/helper'
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

    componentDidMount() {
        this.loadJSON()
    }

    generateNewList(name: string): void {
        // Initialize copy of current list
        let newList: React.ReactElement[] = this.state.list;

        // Initialize copy of ref and create reference to child List
        let refPerList: Map<string, React.RefObject<List>> = this.state.refPerList
        let ref: React.RefObject<List> = React.createRef() as React.RefObject<List>
        refPerList.set(this.state.list.length.toString(), ref)

        // Updates state with the new reference
        this.setState({
            list: this.state.list,
            totalPerList: this.state.totalPerList,
            refPerList: refPerList,
            total: this.state.total,
            next_id: this.state.next_id
        })

        // Add the new list to the copy
        newList.push(<List key={this.state.list.length}
            ref={ref}
            listID={this.state.list.length}
            listName={name}
            onTotal={this.total} />);

        // Initializes total for the new list
        let newTotalList: Map<string, number> = this.state.totalPerList
        newTotalList.set(this.state.list.length.toString(), 0)

        // Finalize updated state and increments next id
        this.setState({
            list: newList,
            totalPerList: newTotalList,
            refPerList: this.state.refPerList,
            total: this.state.total,
            next_id: this.state.next_id + 1
        }, async () => {console.log('done setting state')});

        // Clears input
        (document.getElementById("list_name") as HTMLInputElement).value = "";
        return;
    }

    // Used by the child components to total their items
    // Maybe obsolete
    total = (listID: number, money: number): void => {
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

    getRef(ID: string): React.RefObject<List> | undefined {
        return this.state.refPerList.get(ID)
    }

    // Load from JSON file
    loadJSON(): void {
        fetch(`${API}/load/${getTodaysDate()}`)
            .then(res => res.json())
            .then(res => {
                res.listContainer.forEach(async (e: any) => {
                    console.log(e)
                    let currID = this.state.next_id
                    console.log(currID)
                    this.generateNewList(e.list.name)
                    await sleep(500)
                    console.log(this)
                    // TODO: Going too fast
                    e.list.items.forEach((i: any) => {
                        console.log(this.state.refPerList.get(e.listID.toString()))
                        this.getRef(e.listID.toString())?.current?.generateNewItem(i.money, i.note)
                    })
                })
            })
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
            'listContainer': listData,
            'date': date
        }

        console.log(JSON.stringify(data))

        // Makes the POST call
        fetch(`${API}/save`, {
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
                    console.log(this.state.refPerList)
                    this.state.refPerList.forEach((e) => {
                        console.log(e)
                        e.current?.generateNewItem(0, 'test', 0)
                    })
                }} />
            </div>
        )
    }
}