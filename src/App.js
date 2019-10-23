import React, {useEffect} from 'react';
import useGlobal from "./store";
import Chart from './components/Chart';
import { ElementSelector } from './components/Selectors';
import { CustomBuilder } from './components/Input';
import Loader from './components/Loader';
import { Intro, Copyright } from './components/Text';
import 'sanitize.css';
import './App.scss';

const App = () => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    globalActions.getBrakes();
  }, [globalActions]);

  const { brakes, levers, calipers, elements, customBrakes, customLever, customCaliper, status } = globalState;

  const visibleBrakes = brakes.filter( b => 
    ( !isNaN(b.levMecAvg) && isFinite(b.levMecAvg)) &&
    ( !isNaN(b.levHyd) && isFinite(b.levHyd)) );

  return (
    <div className="App">
      <div className="left">
        <Intro />
        <Chart data={visibleBrakes} customData={customBrakes} elements={elements} loading={status === 'LOADING'}/>
      </div>
      <div className="right">
        <div className="sidebar">
          <Selector 
            title="Show/hide data" 
            elements={elements} 
            toggleData={globalActions.toggleElement}
            stateSelector="elements" />
          <Selector 
            title="Some standard brakes" 
            elements={visibleBrakes} 
            toggleData={globalActions.toggleElement}
            stateSelector="brakes" 
            loading={status === 'LOADING'}/>
          <div className="mixmatch">
            <CustomBuilder 
              title="Mix & match brakes" 
              levers={levers} 
              calipers={calipers} 
              addToBrakes={globalActions.addToBrakes}
              changeValue={globalActions.changeValue}
              customLever={customLever}
              customCaliper={customCaliper}/>
            <Selector 
              elements={customBrakes} 
              toggleData={globalActions.toggleElement}
              stateSelector="customBrakes" />
          </div>          
        </div>
        <Copyright/>
      </div>
    </div>
  )
}

const Selector = (props) => {
  return (
    <div className="selector-wrap">
      {props.title && <h2>{props.title}</h2>}
      <Loader loading={props.loading} />
      {props.elements.map( (el, i) => {
        return (
          <ElementSelector 
            key={i}
            name={el.name} 
            onClick={props.toggleData.bind(this, el, props.stateSelector)}
            visible={el.show}/>
        )}
      )}
    </div>
  )
}

export default App;
