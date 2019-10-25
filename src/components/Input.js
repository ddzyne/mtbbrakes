import React from 'react';
import Select from 'react-dropdown-select';
import { sortBy } from '../datasets/default';
import useGlobal from "../store";


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

export const Sort = (props) => {
  const [globalState, globalActions] = useGlobal();
  return (
    <div className="sort">
      <h5>Sort by</h5>
      <Select
        className="sort-by"
        options={sortBy}
        placeholder="Default"
        labelField="name"
        valueField="variable"
        searchBy="name"
        searchable={false}
        onChange={globalActions.sortData}
        contentRenderer={customContentRendererSort}
        dropdownHandle={false}
        itemRenderer={customItemRendererSort} />
      </div>
  )
}

const customContentRendererSort = ({ props, state, methods }) => {
  return (
    <div className="dropdown-select sort-drop">
      <input 
        className="label" 
        placeholder={state.values.length > 0 ? state.values[0].name : props.placeholder}
        value={state.search}
        onChange={(e)=> methods.setSearch(e)} />
    </div>
)}

const customItemRendererSort = ({ item, itemIndex, props, state, methods }) => {
  return (
    <div className="dropdown-select sort-drop" onClick={() => methods.addItem(item)}>
      <span className="label">{item.name}</span>
    </div>
)}