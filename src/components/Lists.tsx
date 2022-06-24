import React, { Component } from 'react'
import '../css/Lists.css';
import { BudgetList } from '../helper/BudgetList'
import Button from './Button'
import Popup from './Popup';
import TextBox from './TextBox';
import { sleep } from '../helper/helper'
import { faTrashCan, faPlusCircle, faFloppyDisk, faPenToSquare, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Checkbox from './Checkbox';

type Props = { listID: number, ref: React.RefObject<List>, listName: string, isExpenses: boolean, save: Function, updateChart: Function, onDelete: Function }

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
        }
    }

    editItem(id: number, money: number, note: string): void {
        if (this.state.list.editItem({ id: id, money: money, note: note })) {
            this.setState({
                listID: this.state.listID,
                list: this.state.list,
                nextID: this.state.nextID
            })
        }
    }

    editList(name: string, isExpenses: boolean): void {
        this.state.list.setIsExpenses(isExpenses)
        this.state.list.setName(name)
        this.setState({
            listID: this.state.listID,
            list: this.state.list,
            nextID: this.state.nextID
        })
    }

    handleClick = async (e: any): Promise<void> => {
        let id = +e.currentTarget.id,
            money = this.state.list.getItem(+e.currentTarget.id)!.money,
            note = this.state.list.getItem(+e.currentTarget.id)!.note;

        (document.querySelector(`#edit_id_${this.state.listID}`) as HTMLDivElement).innerHTML = `ID: ${id}`;
        (document.querySelector(`#edit_money_${this.state.listID}`) as HTMLInputElement).value = money.toString();
        (document.querySelector(`#edit_note_${this.state.listID}`) as HTMLInputElement).value = note.toString();

        this.toggleEditPopup()
    }

    toggleNewPopup(): void {
        let el = (document.querySelector(`#add_popup_${this.state.listID}`) as HTMLElement)
        if (el.style.display === 'block') {
            el.style.display = 'none'
        } else {
            el.style.display = 'block'
        }
    }

    toggleEditPopup = () => {
        let el = (document.querySelector(`#edit_popup_${this.state.listID}`) as HTMLElement)
        if (el.style.display === 'block') {
            el.style.display = 'none'
        } else {
            el.style.display = 'block'
        }
    }

    toggleListEditPopup(): void {
        let el = (document.querySelector(`#list_edit_popup_${this.state.listID}`) as HTMLElement)
        if (el.style.display === 'block') {
            el.style.display = 'none'
        } else {
            el.style.display = 'block'
        }
    }

    render() {
        return (
            <div className="BudgetList">
                <Popup id={`list_edit_popup_${this.state.listID}`} style={{ display: 'none' }}>
                    List Editing:
                    <Button icon={faFloppyDisk} name={'save'} onClick={async () => {
                        let name = (document.querySelector(`#list_edit_name_${this.state.listID}`) as HTMLInputElement).value
                        let isExpenses = (document.querySelector(`#list_edit_expenses_${this.state.listID}`) as HTMLInputElement).checked
                        this.editList(name, isExpenses)
                        this.toggleListEditPopup()
                        await sleep(250)
                        this.props.save()
                        this.props.updateChart()
                    }} />
                    <Button icon={faTrashCan} name={'delete'} onClick={async () => {
                        if (window.confirm("Are you sure you want to delete the list and its contents?")) {
                            this.props.onDelete(this)
                            this.toggleListEditPopup()
                            await sleep(250)
                            this.props.save()
                            this.props.updateChart()
                        }
                    }} />
                    <TextBox id={`list_edit_name_${this.state.listID}`} placeholder='Name of the list:' />
                    <Checkbox msg={'Is an expense?'} id={`list_edit_expenses_${this.state.listID}`} />
                </Popup>

                <Popup id={`edit_popup_${this.state.listID}`} style={{ display: 'none' }}>
                    Editing:
                    <Button icon={faFloppyDisk} name={'save'} onClick={async () => {
                        let id = parseInt((document.querySelector(`#edit_id_${this.state.listID}`) as HTMLDivElement).innerHTML.split(' ')[1])
                        let money = parseFloat((document.querySelector(`#edit_money_${this.state.listID}`) as HTMLInputElement).value)
                        if (isNaN(money)) {
                            money = 0
                        }
                        let note = (document.querySelector(`#edit_note_${this.state.listID}`) as HTMLInputElement).value
                        if (note === '') {
                            note = '[Note was left empty]'
                        }
                        this.editItem(id, money, note)
                        this.toggleEditPopup();

                        (document.querySelector(`#edit_note_${this.state.listID}`) as HTMLInputElement).value = "";
                        (document.querySelector(`#edit_money_${this.state.listID}`) as HTMLInputElement).value = "";

                        await sleep(250)
                        this.props.save()
                        this.props.updateChart()
                    }} />
                    <Button icon={faTrashCan} name={'delete'} onClick={async () => {
                        let id = parseInt((document.querySelector(`#edit_id_${this.state.listID}`) as HTMLDivElement).innerHTML.split(' ')[1])
                        if (window.confirm("Are you sure you want to delete this item?")) {
                            this.removeItem(id)
                            this.toggleEditPopup()
                            await sleep(250)
                            this.props.save()
                            this.props.updateChart()
                        }
                    }} />
                    <div id={`edit_id_${this.state.listID}`}>ID: </div>
                    <TextBox id={`edit_money_${this.state.listID}`} placeholder='Enter money:' />
                    <TextBox id={`edit_note_${this.state.listID}`} placeholder='Enter note:' />
                </Popup>

                <Popup id={`add_popup_${this.state.listID}`} style={{ display: 'none' }}>
                    Popup for: {this.props.listName}
                    <Button icon={faPlusCircle} name={'new item'} onClick={async () => {
                        let money = parseFloat((document.querySelector(`#add_money_${this.state.listID}`) as HTMLInputElement).value)
                        if (isNaN(money)) {
                            money = 0
                        }
                        let note = (document.querySelector(`#add_note_${this.state.listID}`) as HTMLInputElement).value
                        if (note === '') {
                            note = '[Note was left empty]'
                        }
                        this.generateNewItem(money, note, this.state.nextID)
                        this.toggleNewPopup();

                        (document.querySelector(`#add_note_${this.state.listID}`) as HTMLInputElement).value = "";
                        (document.querySelector(`#add_money_${this.state.listID}`) as HTMLInputElement).value = "";

                        await sleep(250)
                        this.props.save()
                        this.props.updateChart()
                    }} />
                    <TextBox id={`add_money_${this.state.listID}`} placeholder='Enter money:' />
                    <TextBox id={`add_note_${this.state.listID}`} placeholder='Enter note:' />
                </Popup>

                <ul className='BudgetListContainer'>
                    <div className="BudgetListTitle">
                        <div style={{ width: '10%' }}></div>
                        <div id='mid'>{this.state.list.getName()}</div>
                        <Button icon={faPenToSquare} name={'edit item'} onClick={() => {
                            (document.querySelector(`#list_edit_name_${this.state.listID}`) as HTMLInputElement).value = this.getName();
                            this.toggleListEditPopup()
                        }} />
                        <Button icon={faPlusCircle} name={'new item'} onClick={() => { this.toggleNewPopup() }} />
                    </div>
                    <div className="BudgetListCol">
                        <div style={{ width: '5%' }}></div>
                        <div className='Note'>Note</div>
                        <div className='Money'>Money</div>
                    </div>
                    {
                        this.state.list.getItems().map((comp) => {
                            return <div key={comp.id} className="BudgetListCol" id={comp.id.toString()} onClick={this.handleClick}>
                                <FontAwesomeIcon icon={faPencil} />
                                <div className='Note'>{comp.note}</div>
                                <div className='Money'>${comp.money.toFixed(2)}</div>
                            </div>
                        })
                    }
                </ul>
            </div>
        )
    }
}