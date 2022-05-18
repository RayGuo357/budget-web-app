import React from 'react'

type Props = { id: string, placeholder: string }

const TextBox = (props: Props) => {
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