import React, { Component } from 'react'
import '../css/Lists.css';
import { BudgetList } from '../helper/BudgetList'
import Button from './Button'
import Popup from './Popup';
import TextBox from './TextBox';
import { sleep } from '../helper/helper'
import { faTrashCan, faPlusCircle, faFloppyDisk, faPenToSquare, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

    editItem(id: number, money: number, note: string): void {
        if (this.state.list.editItem({ id: id, money: money, note: note })) {
            this.setState({
                listID: this.state.listID,
                list: this.state.list,
                nextID: this.state.nextID
            })
        }
    }

    editName(name: string): void {
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
                        this.editName(name)
                        this.toggleListEditPopup()
                        await sleep(250)
                        this.props.save()
                        this.props.updateChart()
                    }} />
                    <Button icon={faTrashCan} name={'delete'} onClick={async () => {
                        let id = parseInt((document.querySelector(`#edit_id_${this.state.listID}`) as HTMLDivElement).innerHTML.split(' ')[1])
                        // remove list
                        this.toggleListEditPopup()
                        await sleep(250)
                        this.props.save()
                        this.props.updateChart()
                    }} />
                    <TextBox id={`list_edit_name_${this.state.listID}`} placeholder='Name of the list:' />
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
                        this.toggleEditPopup()
                        await sleep(250)
                        this.props.save()
                        this.props.updateChart()
                    }} />
                    <Button icon={faTrashCan} name={'delete'} onClick={async () => {
                        let id = parseInt((document.querySelector(`#edit_id_${this.state.listID}`) as HTMLDivElement).innerHTML.split(' ')[1])
                        this.removeItem(id)
                        this.toggleEditPopup()
                        await sleep(250)
                        this.props.save()
                        this.props.updateChart()
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
                        this.toggleNewPopup()
                        await sleep(250)
                        this.props.save()
                        this.props.updateChart()
                    }} />
                    <TextBox id={`add_money_${this.state.listID}`} placeholder='Enter money:' />
                    <TextBox id={`add_note_${this.state.listID}`} placeholder='Enter note:' />
                </Popup>

                <ul className='BudgetListContainer'>
                    <div className="BudgetListTitle">
                        <Button icon={faPenToSquare} name={'edit item'} onClick={() => { 
                            (document.querySelector(`#list_edit_name_${this.state.listID}`) as HTMLInputElement).value = this.getName();
                            this.toggleListEditPopup() 
                        }}/>
                        <div id='mid'>{this.state.list.getName()}</div>
                        <Button icon={faPlusCircle} name={'new item'} onClick={() => { this.toggleNewPopup() }}/>
                    </div>
                    <div className="BudgetListCol">
                        {/* <div className='ID'>ID</div> */}
                        <div style={{width: '5%'}}></div>
                        <div className='Note'>Note</div>
                        <div className='Money'>Money</div>
                    </div>
                    {
                        this.state.list.getItems().map((comp) => {
                            return <div key={comp.id} className="BudgetListCol" id={comp.id.toString()} onClick={this.handleClick}>
                                {/* <div className='ID'>{comp.id}</div> */}
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