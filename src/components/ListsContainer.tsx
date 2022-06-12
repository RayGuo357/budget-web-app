import React, { Component } from 'react';
import '../css/Lists.css';
import '../css/ListsContainer.css';
import List from './Lists';
import Button from './Button';
import TextBox from './TextBox';
import Checkbox from './Checkbox';
import { getTodaysDate, API, sleep, generatePayload } from '../helper/helper';
import { BudgetList } from '../helper/BudgetList';
import ChartContainer from './ChartContainer';

type Props = { refToChart: React.RefObject<ChartContainer> }

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

    async componentDidMount(): Promise<void> {
        this.loadJSON()
        await sleep(600)
        this.updateChart()
    }

    // TODO: old data
    updateChart = (): void => {
        let labels: string[] = []
        let data: number[] = []

        this.state.refPerList.forEach((e) => {
            console.log(e)
            labels.push(e.current!.state.list.getName())
            data.push(e.current!.state.total)
        })
        this.props.refToChart.current?.updateChart(generatePayload(labels, data))
    }

    generateNewList(name: string, isExpenses: boolean): void {
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
            next_id: this.state.list.length
        })

        // Add the new list to the copy
        newList.push(<List key={this.state.list.length}
            ref={ref}
            listID={this.state.list.length}
            listName={name}
            isExpenses={isExpenses}
            onTotal={this.total}
            save={this.saveAsJSON}
            update={this.updateChart} />);

        // Initializes total for the new list
        let newTotalList: Map<string, number> = this.state.totalPerList
        newTotalList.set(this.state.list.length.toString(), 0)

        // Finalize updated state and increments next id
        this.setState({
            list: newList,
            totalPerList: newTotalList,
            refPerList: this.state.refPerList,
            total: this.state.total,
            next_id: newList.length
        });

        // Clears input
        (document.querySelector("#list_name") as HTMLInputElement).value = "";
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
            next_id: this.state.list.length
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
                    this.generateNewList(e.list.name, e.list.isExpenses)
                    await sleep(500)
                    let newList = new BudgetList(e.list.name, e.list.isExpenses)
                    e.list.items.forEach((i: {id: number, money: number, note: string}) => {
                        newList.addItem({
                            id: i.id,
                            money: i.money,
                            note: i.note
                        })
                    })
                    e.list = newList
                    this.getRef(e.listID.toString())?.current?.setState(e)
                })
            })
    }

    // API call to server to save as JSON
    saveAsJSON = (): void => {
        console.log('saving')
        // Creates body to send with API call
        let date: string = getTodaysDate()
        let listData: {}[] = []
        this.state.refPerList.forEach((e) => {
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
                <Checkbox id='is_expenses' msg='Is an Expense?' />
                <Button name={'new list'} onClick={() => {
                    let name = (document.querySelector("#list_name") as HTMLInputElement).value
                    let isExpenses = (document.querySelector('#is_expenses') as HTMLInputElement).checked
                    this.generateNewList(name, isExpenses)
                    // this.saveAsJSON()
                }} />
                <div>Total: {this.state.total}</div>
                <div>Today is: {getTodaysDate()}</div>
                <Button name={'save'} onClick={() => {
                    this.saveAsJSON()
                }} />
                <Button name={'test'} onClick={() => {
                    this.updateChart()
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