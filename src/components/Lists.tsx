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

    deleteNewItem(item: Items): void {
        this.state.list.removeItem(item);
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
                            return  <div className="BudgetListCol">
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
                    this.deleteNewItem({id: parseInt((document.getElementById(`id_delete_${this.state.listID}`) as HTMLInputElement).value), money: 0, note: ""})
                    this.setState({
                        listID: this.state.listID,
                        list: this.state.list,
                        id: this.state.id
                    })
                }} />
                <TextBox id={`id_delete_${this.state.listID}`}/>
            </div>
        )
    }
}