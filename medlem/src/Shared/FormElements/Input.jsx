import React from 'react'

function Input({type,id,name,placeholder,value,onChange,password,readOnly}) {

 const element =  type === "input"?
  <input readOnly={readOnly} required onChange={onChange} type={password?("password"):("text")} id={id} name={name} placeholder={placeholder} value={value} />:
  <textarea onChange={onChange} name={name} id={id} value={value} placeholder={placeholder}></textarea>

  return (
   <div>
    {element}
   </div>
  )
}

export default Input
