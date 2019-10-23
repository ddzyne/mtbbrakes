import React from 'react';

export const ElementSelector = (props) => {
  return (
    <div className={`tgl-flat selector ${props.visible ? 'visible' : 'hidden'}`} onClick={props.onClick}>
      <span className="tgl-btn"></span>
      <span>{props.name}</span>
    </div>
  )
}