import React, { Component, MouseEventHandler } from 'react'
import '../css/Lists.css';
import { BudgetList } from '../helper/BudgetList'
import Button from './Button'
import Popup from './Popup';
import TextBox from './TextBox';
import { sleep } from '../helper/helper'

type Props = { listID: number, ref: React.RefObject<List>, listName: string, isExpenses: boolean, onTotal: Function, save: Function, update: Function }

type State = { listID: number, list: BudgetList, total: number, nextID: number }

export default class List extends Component<Props, State> {
    state: State = {
        listID: this.props.listID,
        list: new BudgetList(this.props.listName, this.props.isExpenses),
        total: 0,
        nextID: 0
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
                total: this.state.list.getTotal(),
                nextID: this.state.nextID + 1
            })
            this.props.onTotal(this.state.listID, this.state.list.getTotal())
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
                total: this.state.list.getTotal(),
                nextID: this.state.nextID
            })
            this.props.onTotal(this.state.listID, this.state.list.getTotal())
        }
    }

    handleClick = async (e: any): Promise<void> => {
        this.removeItem(+e.currentTarget.id)
        await sleep(250)
        this.props.save()
        this.props.update()
    }

    render() {
        return (
            <div className="BudgetList">
                <Popup id={`popup${this.state.listID}`} style={{ display: 'none' }}>
                    Popup for: {this.props.listName}
                    <Button name={'new item'} onClick={async () => {
                        this.generateNewItem(this.state.nextID * 200, `Sample note with id: ${this.state.nextID}`, this.state.nextID)
                        await sleep(250)
                        this.props.save()
                        this.props.update()
                    }} />
                    <Button name={'delete'} onClick={() => {
                        this.removeItem(parseInt((document.querySelector(`#id_delete_${this.state.listID}`) as HTMLInputElement).value))
                        this.props.save()
                    }} />
                    <TextBox id={`id_delete_${this.state.listID}`} placeholder='Enter item ID to delete:' />
                </Popup>
                <ul className='BudgetListContainer'>
                    <div className="BudgetListTitle" onClick={() => this.newItemPopUp()}>{this.state.list.getName()}</div>
                    <div className="BudgetListCol">
                        <div className='ID'>ID</div>
                        <div className='Money'>Money</div>
                        <div className='Note'>Note</div>
                    </div>
                    {
                        this.state.list.getItems().map((comp) => {
                            return <div key={comp.id} className="BudgetListCol" id={comp.id.toString()} onClick={this.handleClick}>
                                <div className='ID'>{comp.id}</div>
                                <div className='Money'>{comp.money}</div>
                                <div className='Note'>{comp.note}</div>
                            </div>
                        })
                    }
                </ul>
                <Button name={'test state'} onClick={() => {
                    console.log(this.state)
                }}/>
                <div>Total for {this.props.listName}: {this.state.total}</div>
            </div>
        )
    }
}