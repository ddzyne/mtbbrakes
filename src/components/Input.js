import React from 'react';
import Select from 'react-dropdown-select';

export function CustomBuilder(props) {
  return (
    <div className="selector-wrap">
      <h2>{props.title}</h2>
      <p>Mix and match your own brake levers and calipers to see how they compare to 'factory' brakes</p>
      <div className="brake-creator">
        <Select
          options={props.levers}
          labelField="fullName"
          valueField="code"
          placeholder="Select lever"
          onChange={props.changeValue.bind(this, 'lever')}
          values={props.customLever}
          searchBy="fullName"
          itemRenderer={customItemRenderer}
          contentRenderer={customContentRenderer}
          dropdownHandle={false}
          dropdownHeight="150px"
        />
        <Select
          options={props.calipers}
          labelField="fullName"
          valueField="code"
          placeholder="Select caliper"
          onChange={props.changeValue.bind(this, 'caliper')}
          values={props.customCaliper}
          searchBy="fullName"
          itemRenderer={customItemRenderer}
          contentRenderer={customContentRenderer}
          dropdownHandle={false}
          dropdownHeight="150px"
        />
        <div className="add button" onClick={props.addToBrakes}>Add</div>
      </div>
    </div>
  )
}

function customItemRenderer({ item, itemIndex, props, state, methods }) {
  return (
    <div className="dropdown-select" onClick={() => methods.addItem(item)}>
      <span className="label">{item.fullName}</span>
      <span className={`${item.fluid} fluid`}>{item.fluid}</span>
    </div>
)}

function customContentRenderer({ props, state, methods }) {
  console.log(state)
  console.log(props)
  return (
    <div className="dropdown-select">
      <input 
        className="label" 
        placeholder={state.values.length > 0 ? state.values[0].fullName : props.placeholder}
        value={state.search}
        onChange={(e)=> methods.setSearch(e)}
        />
      {state.values.length > 0 &&
        <span className={`${state.values[0].fluid} fluid`}>{state.values[0].fluid}</span>
      }
    </div>
)}