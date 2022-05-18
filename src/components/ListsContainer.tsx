import React, { Component } from 'react'
import '../css/Lists.css';
import List from './Lists'
import Button from './Button'
import TextBox from './TextBox';

type Props = {}

type State = { list: React.ReactElement[], next_id: number }

export default class ListsContainer extends Component<Props, State> {
    state: State = {
        list: [],
        next_id: 0
    }

    generateNewList(): void {
        let newList: React.ReactElement[] = this.state.list;
        
        let name: string = (document.getElementById("list_name") as HTMLInputElement).value;

        newList.push(<List listID={this.state.next_id} listName={name}/>);
        this.setState({
            list: newList,
            next_id: this.state.next_id + 1
        });
        (document.getElementById("list_name") as HTMLInputElement).value = "";
        return;
    }

    render() {
        return (
            <div className="ListContainer">
                {
                    this.state.list.map((comp) => {
                        return comp
                    })
                }
                <TextBox id='list_name'/>
                <Button name={'new list'} onClick={() => {
                    this.generateNewList()
                }} />
            </div>
        )
    }
}