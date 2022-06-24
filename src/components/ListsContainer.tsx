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
import Popup from './Popup';
import { faPenToSquare, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

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
        let labels: string[] = ['Available']
        let data: number[] = [0]
        let incomeMap: Map<string, number> = new Map<string, number>()
        let expensesMap: Map<string, number> = new Map<string, number>()
        let expenses = 0
        let income = 0

        this.state.refPerList.forEach((e) => {

            if (e.current!.state.list.getIsExpenses()) {
                labels.push(e.current!.state.list.getName())
                data.push(e.current!.getTotal())
                expenses += e.current!.getTotal()
                expensesMap.set(e.current!.getName(), e.current!.getTotal())
            } else {
                income += e.current!.getTotal()
                incomeMap.set(e.current!.getName(), e.current!.getTotal())
            }
        })
        data[0] = income - expenses
        this.props.refToChart.current?.updateChart(generatePayload(labels, data), incomeMap, expensesMap)
    }

    generateNewListForLoading(name: string, isExpenses: boolean): void {
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
            save={this.saveAsJSON}
            updateChart={this.updateChart} 
            onDelete={this.onDelete} />);

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

    generateNewList(name: string, isExpenses: boolean): void {
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
            isExpenses={isExpenses}
            save={this.saveAsJSON}
            updateChart={this.updateChart} 
            onDelete={this.onDelete} />);

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
        (document.querySelector("#list_name") as HTMLInputElement).value = "";
        return;
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
                    this.generateNewListForLoading(e.list.name, e.list.isExpenses)
                    await sleep(500)
                    let newList = new BudgetList(e.list.name, e.list.isExpenses)
                    e.list.items.forEach((i: { id: number, money: number, note: string }) => {
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

    togglePopUp = (): void => {
        let el = (document.querySelector('#LCPopup') as HTMLElement)
        if (el.style.display === 'block') {
            el.style.display = 'none'
        } else {
            el.style.display = 'block'
        }
    }

    onDelete = (item: React.ReactElement): void => {
        let newList: React.ReactElement[] = []

        this.state.list.forEach((e, ind) => {
            if (e.props.listID !== item.props.listID) {
                newList.push(e)
            } else {
                this.state.refPerList.delete(ind.toString())
            }
        })

        this.setState({
            list: newList,
            totalPerList: this.state.totalPerList,
            refPerList: this.state.refPerList,
            total: this.state.total,
            next_id: this.state.next_id
        })
    }

    render() {
        return (
            <div className="ListContainer">
                <Popup id='LCPopup' style={{ display: 'none' }}>
                    <TextBox id='list_name' placeholder='Enter new list name:' />
                    <Checkbox id='is_expenses' msg='Is an Expense?' />
                    <Button icon={faPlusCircle} name={'new list'} onClick={() => {
                        let name = (document.querySelector("#list_name") as HTMLInputElement).value
                        let isExpenses = (document.querySelector('#is_expenses') as HTMLInputElement).checked
                        this.generateNewList(name, isExpenses)
                        this.togglePopUp()
                    }} />
                </Popup>
                <div className='ListTable'>
                    {
                        this.state.list.map((comp) => {
                            return comp
                        })
                    }
                </div>
                <div className='editButton'>
                    <Button className="test" icon={faPenToSquare} name='X' onClick={() => {
                        this.togglePopUp()
                    }} />
                </div>
            </div>
        )
    }
}