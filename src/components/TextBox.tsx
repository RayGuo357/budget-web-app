import React from 'react'
import { useState } from 'react'

type Props = { id: string, placeholder: string }

const TextBox = (props: Props) => {
    const [name, setName] = useState("")
    return (
        <div className="TextBox">
            <input
                id={props.id}
                type="text"
                placeholder={props.placeholder}
            />
        </div>
    )
}

export default TextBox