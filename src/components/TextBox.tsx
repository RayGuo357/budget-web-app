import React from 'react'
import { useState } from 'react'

type Props = { id: string }

const TextBox = (props: Props) => {
    const [name, setName] = useState("")
    return (
        <div className="TextBox">
            <input
                id={props.id}
                type="text"
            />
        </div>
    )
}

export default TextBox