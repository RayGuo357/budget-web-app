import React, { Component } from 'react'
import '../css/Lists.css';
import { BudgetList } from '../helper/BudgetList'
import Button from './Button'
import Popup from './Popup';
import TextBox from './TextBox';

type Props = { listID: number, ref: React.RefObject<List>, listName: string, onTotal: any }

type State = { listID: number, list: BudgetList, total: number, nextID: number }

export default class List extends Component<Props, State> {
    state: State = {
        listID: this.props.listID,
        list: new BudgetList(this.props.listName, false),
        total: 0,
        nextID: 0
    }

    newItemPopUp(): void {
        let el = (document.getElementById(`popup${this.state.listID}`) as HTMLElement)
        if (el.style.display === 'block') {
            el.style.display = 'none'
        } else {
            el.style.display = 'block'
        }
    }

    generateNewItem(id: number, money: number, note: string): boolean {
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

    removeItem(id: number) {
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

    render() {
        return (
            <div className="BudgetList">
                <Popup id={`popup${this.state.listID}`} style={{ display: 'none' }}>
                    Popup for: {this.props.listName}
                    <Button name={'new item'} onClick={() => {
                        this.generateNewItem(this.state.nextID, this.state.nextID * 200, `Sample note with id: ${this.state.nextID}`)
                    }} />
                    <Button name={'delete'} onClick={() => {
                        this.removeItem(parseInt((document.getElementById(`id_delete_${this.state.listID}`) as HTMLInputElement).value))
                    }} />
                    <TextBox id={`id_delete_${this.state.listID}`} placeholder='Enter item ID to delete:' />
                </Popup>
                <ul className='BudgetListContainer'>
                    <div className="BudgetListTitle">{this.state.list.getName()}</div>
                    <div className="BudgetListCol">
                        <div className='ID'>ID</div>
                        <div className='Money'>Money</div>
                        <div className='Note'>Note</div>
                    </div>
                    {
                        this.state.list.getItems().map((comp) => {
                            return <div key={comp.id} className="BudgetListCol">
                                <div className='ID'>{comp.id}</div>
                                <div className='Money'>{comp.money}</div>
                                <div className='Note'>{comp.note}</div>
                            </div>
                        })
                    }
                </ul>
                <Button name={'Edit list'} onClick={() => {
                    this.newItemPopUp()
                }} />
                <Button name={'test state'} onClick={() => {
                    console.log(this.state)
                }}/>
                <div>Total for {this.props.listName}: {this.state.total}</div>
            </div>
        )
    }
}