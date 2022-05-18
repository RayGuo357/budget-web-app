import React, { Component } from 'react'
import '../css/Lists.css';
import { BudgetList, Items } from '../helper/BudgetList'
import Button from './Button'
import TextBox from './TextBox';

type Props = { listID: number, listName: string }

type State = { listID: number, list: BudgetList, id: number }

export default class List extends Component<Props, State> {
    state: State = {
        listID: this.props.listID,
        list: new BudgetList(this.props.listName, false),
        id: 0
    }

    generateNewItem(): boolean {
        if (this.state.list.addItem({
            id: this.state.id,
            money: this.state.id * 200,
            note: `Sample note with id: ${this.state.id}`
        })) {
            this.setState({
                listID: this.state.listID,
                list: this.state.list,
                id: this.state.id + 1
            })
            return true;
        } else {
            return false;
        }
    }

    render() {
        return (
            <div className="BudgetList">
                <ul className='BudgetListContainer'>
                    <div className="BudgetListTitle">{this.state.list.getName()}</div>
                    <div className="BudgetListCol">
                        <div className='ID'>ID</div>
                        <div className='Money'>Money</div>
                        <div className='Note'>Note</div>
                    </div>
                    {
                        this.state.list.getItems().map((comp) => {
                            return  <div key={comp.id} className="BudgetListCol">
                                        <div className='ID'>{comp.id}</div>
                                        <div className='Money'>{comp.money}</div>
                                        <div className='Note'>{comp.note}</div>
                                    </div>
                        })
                    }
                </ul>
                <Button name={'new item'} onClick={() => {
                    this.generateNewItem()
                }} />
                <Button name={'delete'} onClick={() => {
                    this.state.list.removeItem(parseInt((document.getElementById(`id_delete_${this.state.listID}`) as HTMLInputElement).value))
                    this.setState({
                        listID: this.state.listID,
                        list: this.state.list,
                        id: this.state.id
                    })
                }} />
                <TextBox id={`id_delete_${this.state.listID}`} placeholder='Enter item ID to delete:'/>
            </div>
        )
    }
}