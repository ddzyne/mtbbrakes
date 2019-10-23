import React from 'react';
import Select from 'react-dropdown-select';

export const CustomBuilder = (props) => {
  return (
    <div className="selector-wrap">
      <h2>{props.title}</h2>
      <p>Mix and match your own brake levers and calipers to see how they compare to 'factory' brakes</p>
      <div className="brake-creator">
        <Select
          options={props.levers}
          labelField="name"
          valueField="lever"
          placeholder="Select lever"
          onChange={props.changeValue.bind(this, 'lever')}
          values={props.customLever}
          searchBy="name"
          itemRenderer={customItemRenderer}
          contentRenderer={customContentRenderer}
          dropdownHandle={false}
          dropdownHeight="200px"
        />
        <Select
          options={props.calipers}
          labelField="name"
          valueField="caliper"
          placeholder="Select caliper"
          onChange={props.changeValue.bind(this, 'caliper')}
          values={props.customCaliper}
          searchBy="name"
          itemRenderer={customItemRenderer}
          contentRenderer={customContentRenderer}
          dropdownHandle={false}
          dropdownHeight="200px"
        />
        <div className="add button" onClick={props.addToBrakes}>Add</div>
      </div>
    </div>
  )
}

const customItemRenderer = ({ item, itemIndex, props, state, methods }) => {
  return (
    <div className="dropdown-select" onClick={() => methods.addItem(item)}>
      <span className="label">{item.brand} {props.valueField === 'lever' ? item.lever : item.caliper}</span>
      <span className={`${item.oil} fluid`}>{item.oil}</span>
    </div>
)}

const customContentRenderer = ({ props, state, methods }) => {
  return (
    <div className="dropdown-select">
      <input 
        className="label" 
        placeholder={state.values.length > 0 ? ( state.values[0].brand + ' ' + (props.valueField === 'lever' ? state.values[0].lever : state.values[0].caliper ) ) : props.placeholder}
        value={state.search}
        onChange={(e)=> methods.setSearch(e)}
        />
      {state.values.length > 0 &&
        <span className={`${state.values[0].oil} fluid`}>{state.values[0].oil}</span>
      }
    </div>
)}