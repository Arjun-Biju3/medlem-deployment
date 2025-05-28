import React from 'react'

function Button({name,onClick,type,className,disabled}) {
  return (
    <button className={className} disabled={disabled}  onClick={onClick} type={type}>{name}</button>
  )
}

export default Button
