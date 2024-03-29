import React from 'react';
import { FadeLoader } from './Loader';

export const Selector = (props) => {
  return (
    <div className="selector-wrap">
      {props.title && <h2>{props.title}</h2>}
      <FadeLoader loading={props.loading} className="absolute" />
      {props.elements && props.elements.map( (el, i) => {
        const name = el.name.toString().indexOf(' (custom)') !== -1 ? el.name.replace(' (custom)', '') : el.name;
        return (
          <ElementSelector 
            key={i}
            name={name} 
            onClick={props.toggleData.bind(this, el, props.stateSelector)}
            visible={el.show}
            custom={props.stateSelector === 'customBrakes'}
            oilCompatible={el.oilCompatible}/>
        )}
      )}
      {props.secondaryElements && props.secondaryElements.map( (el, i) => {
        return (
          <ElementSelector 
            key={i}
            name={el.name} 
            onClick={props.toggleData.bind(this, el, props.secondaryStateSelector)}
            visible={el.show}/>
        )}
      )}
    </div>
  )
}

export const ElementSelector = (props) => {
  return (
    <div className={`tgl-flat selector ${props.visible ? 'visible' : 'hidden'}`} onClick={props.onClick}>
      <span className="tgl-btn"></span>
      <span className="label">{props.name}</span>
      {props.custom && !props.oilCompatible && <span className="incompatible">Incompatible fluids</span>}
    </div>
  )
}