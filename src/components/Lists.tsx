import React, { Component } from 'react'
import { BudgetList, Items } from '../helper/BudgetList'
import Button from './Button'

type Props = {key: number}

type State = { key: number, list: BudgetList, id: number}

export default class List extends Component<Props, State> {
    state: State = {
        key: this.props.key,
        list: new BudgetList("test", false),
        id: 0
    }

    generateNewItem(): boolean {
        if (this.state.list.addItem({
            id: this.state.id,
            money: this.state.id * 200,
            note: `Sample note with id: ${this.state.id}`
        })) {
            this.setState({
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
            <div>{JSON.stringify(this.state.list)}
                <Button name={'new item'} onClick={() => {
                    this.generateNewItem()
                }} />
            </div>
        )
    }
}