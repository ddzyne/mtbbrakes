import React from 'react';
import Select from 'react-dropdown-select';
import { sortBy } from '../datasets/default';
import useGlobal from "../store";

export const CustomBuilder = ({ title, levers, customLever, calipers, customCaliper, changeValue, addToBrakes }) => {
  return (
    <div className="selector-wrap">
      <h2>{title}</h2>
      <p>Mix and match your own brake levers and calipers to see how they compare to 'factory' brakes</p>
      <div className="brake-creator">
        <Select
          options={levers}
          labelField="name"
          valueField="lever"
          placeholder="Select lever"
          onChange={changeValue.bind(this, 'lever')}
          values={customLever}
          searchBy="name"
          itemRenderer={customItemRenderer}
          contentRenderer={customContentRenderer}
          dropdownHandle={false}
          dropdownHeight="200px"
        />
        <Select
          options={calipers}
          labelField="name"
          valueField="caliper"
          placeholder="Select caliper"
          onChange={changeValue.bind(this, 'caliper')}
          values={customCaliper}
          searchBy="name"
          itemRenderer={customItemRenderer}
          contentRenderer={customContentRenderer}
          dropdownHandle={false}
          dropdownHeight="200px"
        />
        <div className="add button" onClick={addToBrakes}>Add</div>
      </div>
    </div>
  )
}

const customItemRenderer = ({ item, itemIndex, valueField, state, methods }) => {
  return (
    <div className="dropdown-select" onClick={() => methods.addItem(item)}>
      <span className="label">{item.brand} {valueField === 'lever' ? item.lever : item.caliper}</span>
      <span className={`${item.oil} fluid`}>{item.oil}</span>
    </div>
)}

const customContentRenderer = ({ valueField, placeholder, state, methods }) => {
  return (
    <div className="dropdown-select">
      <input 
        className="label" 
        placeholder={state.values.length > 0 ? ( state.values[0].brand + ' ' + (valueField === 'lever' ? state.values[0].lever : state.values[0].caliper ) ) : placeholder}
        value={state.search}
        onChange={(e)=> methods.setSearch(e)}
        />
      {state.values.length > 0 &&
        <span className={`${state.values[0].oil} fluid`}>{state.values[0].oil}</span>
      }
    </div>
)}

export const Sort = () => {
  const [globalState, globalActions] = useGlobal();
  return (
    <div className="sort">
      <h5>Sort by</h5>
      <Select
        className="sort-by"
        options={sortBy}
        placeholder="Strongest brake first"
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