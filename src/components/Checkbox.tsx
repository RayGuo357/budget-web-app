import React, { useState } from 'react'

type Props = { msg: string, id: string }

const Checkbox = (props: Props) => {
    const [isChecked , setIsChecked] = useState(false)

    const handleOnChange = () => {
        setIsChecked(!isChecked)
    }

    return (
        <div className="Checkbox">
            {props.msg}
            <input
                id={props.id}
                type="checkbox"
                checked={isChecked}
                onChange={handleOnChange}
            />
        </div>
    )
}

export default Checkbox