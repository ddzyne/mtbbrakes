import React from 'react';
import Chart from './components/Chart';
import { ElementSelector } from './components/Selectors';
import { CustomBuilder } from './components/Input';
import { Intro, Copyright } from './components/Text';
import {levers, calipers} from './datasets/data';
import {standardBrakes, standardElements} from './datasets/default';
import {findItem, calculateHydro, calculateMech, calculateTotal} from './helpers/calc';
import 'sanitize.css';
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brakes: standardBrakes.map( el => {
        return {
          name: el.customName,
          lever: findItem(el.lever, levers), 
          caliper: findItem(el.caliper, calipers),
          show: true,
        }
      }),
      elements: standardElements,
      customBrakes: [],
      customLever: [],
      customCaliper: [],
    }
    this.toggleElement = this.toggleElement.bind(this);
    this.addToBrakes = this.addToBrakes.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }
  toggleElement(element, stateSelector) {
    this.setState(state => {
      const nextElements = state[stateSelector].map( el => {
        if (element.hasOwnProperty('caliper') && (el.caliper.code !== element.caliper.code || el.lever.code !== element.lever.code)) return el;
        else if (el.variable !== element.variable) return el;
        return {
          ...el,
          show: !el.show,
        }
      });
      return { ...state, [stateSelector]: nextElements };
    });
  }
  changeValue(type, val) {
    type === 'lever' ? this.setState({customLever:val}) : this.setState({customCaliper:val});
  }
  addToBrakes() {
    if( this.state.customLever[0] && this.state.customCaliper[0] ) {
      const newBrake = {
        lever: this.state.customLever[0], 
        caliper: this.state.customCaliper[0],
        show: true,
        name: `${this.state.customLever[0].fullName} / ${this.state.customCaliper[0].fullName}`,
      }
      this.setState(state => {
        const customBrakes = [...state.customBrakes, newBrake]
        return {...state, customBrakes: customBrakes, customLever: [], customCaliper: []};
      });
    }
  }
  render() {
    const {brakes, elements, customBrakes, customLever, customCaliper} = this.state; 

    const dataBrakes = brakes.concat(customBrakes);

    const curData = dataBrakes.map( el => {
      return el.show && {
        name: el.name,
        levMec: calculateMech(el.lever, el.caliper),
        levHyd: calculateHydro(el.lever, el.caliper),
        levTot: calculateTotal(el.lever, el.caliper),
      }
    }).filter(Boolean);

    return (
      <div className="App">
        <div className="left">
          <Intro />
          <Chart data={curData} elements={elements}/>
        </div>
        <div class="right">
          <div className="sidebar">
            <Selector 
              title="Show/hide data" 
              elements={elements} 
              toggleData={this.toggleElement}
              stateSelector="elements" />
            <Selector 
              title="Some standard brakes" 
              elements={brakes} 
              toggleData={this.toggleElement}
              stateSelector="brakes" />
            <div className="mixmatch">
              <CustomBuilder 
                title="Mix & match brakes" 
                levers={levers} 
                calipers={calipers} 
                addToBrakes={this.addToBrakes}
                changeValue={this.changeValue}
                customLever={customLever}
                customCaliper={customCaliper}/>
              <Selector 
                elements={customBrakes} 
                toggleData={this.toggleElement}
                stateSelector="customBrakes" />
            </div>          
          </div>
          <Copyright/>
        </div>
      </div>
    );
  }
}

function Selector(props) {
  return (
    <div className="selector-wrap">
      {props.title && <h2>{props.title}</h2>}
      {props.elements.map( (el, i) =>
        <ElementSelector 
          key={i}
          name={el.name} 
          onClick={props.toggleData.bind(this, el, props.stateSelector)}
          visible={el.show}/>
      )}
    </div>
  )
}

export default App;
