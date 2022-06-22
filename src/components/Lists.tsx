import React, { Component } from 'react'
import '../css/Lists.css';
import { BudgetList } from '../helper/BudgetList'
import Button from './Button'
import Popup from './Popup';
import TextBox from './TextBox';
import { sleep } from '../helper/helper'

type Props = { listID: number, ref: React.RefObject<List>, listName: string, isExpenses: boolean, save: Function, updateChart: Function }

type State = { listID: number, list: BudgetList, nextID: number }

export default class List extends Component<Props, State> {
    state: State = {
        listID: this.props.listID,
        list: new BudgetList(this.props.listName, this.props.isExpenses),
        nextID: 0
    }

    getTotal(): number {
        return this.state.list.getTotal()
    }

    getName(): string {
        return this.state.list.getName()
    }

    newItemPopUp(): void {
        let el = (document.querySelector(`#popup${this.state.listID}`) as HTMLElement)
        if (el.style.display === 'block') {
            el.style.display = 'none'
        } else {
            el.style.display = 'block'
        }
    }

    generateNewItem(money: number, note: string, id: number = this.state.list.getItems().length): boolean {
        if (this.state.list.addItem({
            id: id,
            money: money,
            note: note
        })) {
            this.setState({
                listID: this.state.listID,
                list: this.state.list,
                nextID: this.state.nextID + 1
            })
            // this.props.onTotal(this.state.listID, this.state.list.getTotal())
            return true;
        } else {
            return false;
        }
    }

    removeItem(id: number): void {
        if (this.state.list.removeItem(id)) {
            this.setState({
                listID: this.state.listID,
                list: this.state.list,
                nextID: this.state.nextID
            })
            // this.props.onTotal(this.state.listID, this.state.list.getTotal())
        }
    }

    handleClick = async (e: any): Promise<void> => {
        this.removeItem(+e.currentTarget.id)
        await sleep(250)
        this.props.save()
        this.props.updateChart()
    }

    render() {
        return (
            <div className="BudgetList">
                <Popup id={`popup${this.state.listID}`} style={{ display: 'none' }}>
                    Popup for: {this.props.listName}
                    <Button name={'new item'} onClick={async () => {
                        let money = parseFloat((document.querySelector(`#money_${this.state.listID}`) as HTMLInputElement).value)
                        let note = (document.querySelector(`#note_${this.state.listID}`) as HTMLInputElement).value
                        this.generateNewItem(money, note, this.state.nextID)
                        await sleep(250)
                        this.props.save()
                        this.props.updateChart()
                    }} />
                    <TextBox id={`money_${this.state.listID}`} placeholder='Enter money:' />
                    <TextBox id={`note_${this.state.listID}`} placeholder='Enter note:' />
                </Popup>
                <ul className='BudgetListContainer'>
                    <div className="BudgetListTitle" onClick={() => this.newItemPopUp()}>{this.state.list.getName()}</div>
                    <div className="BudgetListCol">
                        {/* <div className='ID'>ID</div> */}
                        <div className='Note'>Note</div>
                        <div className='Money'>Money</div>
                    </div>
                    {
                        this.state.list.getItems().map((comp) => {
                            return <div key={comp.id} className="BudgetListCol" id={comp.id.toString()} onClick={this.handleClick}>
                                {/* <div className='ID'>{comp.id}</div> */}
                                <div className='Note'>{comp.note}</div>
                                <div className='Money'>{comp.money}</div>
                            </div>
                        })
                    }
                </ul>
            </div>
        )
    }
}