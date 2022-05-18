import React, { useState } from 'react'
import Button from './Button'

type Props = { id: string, style: any, children: React.ReactNode }

const Popup = (props: Props) => {
    const [style, setStyle] = useState(props.style)
    return (
        <div className="Popup" id={props.id} style={style}>
            <div className='PopupOuter'></div>
            <div className='PopupInner'>
                <Button name='X' onClick={() => {
                    (document.getElementById(props.id) as HTMLElement).style.display = 'none'
                }} />
                {props.children}
            </div>
        </div>
    )
}

export default Popup