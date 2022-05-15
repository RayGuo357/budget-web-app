import React from 'react'

type onClick = () => void;
type Props = { name: string, onClick: onClick };

const Button = (props: Props) => {
  return (
    <button name={props.name} onClick={props.onClick}>
        <img src="" alt={props.name}/>
    </button>
  )
}

export default Button;