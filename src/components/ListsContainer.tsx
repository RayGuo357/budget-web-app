import React, { Component } from 'react'
import List from './Lists'
import Button from './Button'

type Props = {}

type State = { list: React.ReactElement[], next_id: number }

export default class ListsContainer extends Component<Props, State> {
    state: State = {
        list: [<List key={0} />, <List key={1} />],
        next_id: 0
    }

    generateNewList(): void {
        let newList: React.ReactElement[] = this.state.list;
        newList.push(<List key={this.state.next_id} />)
        this.setState({
            list: newList,
            next_id: this.state.next_id + 1
        })
        console.log(this.state.list)
        this.render()
        return;
    }

    render() {
        return (
            <div>
                {
                    this.state.list.map((comp) => {
                        return comp
                    })
                }
                <Button name={'new list'} onClick={() => {
                    this.generateNewList()
                }} />
            </div>
        )
    }
}