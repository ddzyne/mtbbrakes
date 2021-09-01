import React from 'react';
import Select from 'react-dropdown-select';
import { sortBy } from '../datasets/default';
import useGlobal from "../store";


export const CustomBuilder = (props) => 
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
        dropdownHandle={true}
        dropdownHeight="250px"
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
        dropdownHandle={true}
        dropdownHeight="250px"
      />
      <div className="add button" onClick={props.addToBrakes}>Add</div>
    </div>
  </div>

const customItemRenderer = ({ item, itemIndex, props, state, methods }) =>
  <div className={`dropdown-select ${state.values.length > 0 && item.id === state.values[0].id ? 'selected' : ''}`} onClick={() => methods.addItem(item)}>
    <span className="label">{item.brand} {props.valueField === 'lever' ? item.lever : item.caliper}</span>
    <span className={`${item.oil} fluid`}>{item.oil}</span>
  </div>

const customContentRenderer = ({ props, state, methods }) => {
  const value = state.values.length > 0 ?
    ( state.values[0].brand + ' ' + (props.valueField === 'lever' ? state.values[0].lever : state.values[0].caliper ) ) :
    '';
  return (
    <div className="dropdown-select">
      <input 
        className="label" 
        placeholder={props.placeholder}
        value={state.dropdown ? state.search : value}
        onChange={(e)=> methods.setSearch(e)}
        />
      {state.values.length > 0 && !state.dropdown &&
        <span className={`${state.values[0].oil} fluid`}>{state.values[0].oil}</span>
      }
    </div>
  )
}

export const Sort = (props) => {
  const [globalState, globalActions] = useGlobal();
  return (
    <div className="sort">
      <h5>Sort by</h5>
      <Select
        values={[ sortBy.find( e => e.variable === globalState.sortBy ) ]}
        className="sort-by"
        options={sortBy}
        labelField="name"
        valueField="variable"
        searchBy="name"
        searchable={false}
        onChange={globalActions.sortData}
        dropdownHandle={true} />
      </div>
  )
}