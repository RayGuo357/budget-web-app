import { faPenToSquare, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

type onClick = () => void;
type Props = { className?: string, icon?: IconDefinition, name: string, onClick: onClick };

const Button = (props: Props) => {
  return (
    <button name={props.name} onClick={props.onClick} style={{backgroundColor: 'transparent', borderWidth: 0}}>
        <FontAwesomeIcon className={props.className} icon={props.icon ? props.icon : faPenToSquare} />
    </button>
  )
}

export default Button;