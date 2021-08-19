import React, { useEffect } from 'react';
import useGlobal from "./store";
import Chart from './components/Chart';
import { Selector } from './components/Selectors';
import { CustomBuilder } from './components/Input';
import { Intro, Copyright } from './components/Text';
import 'sanitize.css';
import './App.scss';

const App = () => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    globalActions.getBrakes();
  }, [globalActions]);

  const { 
    brakes, 
    levers, 
    calipers, 
    elements, 
    secondaryElements, 
    customBrakes, 
    customLever, 
    customCaliper, 
    status,
  } = globalState;

  const visibleBrakes = brakes.filter( b => 
    ( !isNaN(b.levMecAvg) && isFinite(b.levMecAvg) ) &&
    ( !isNaN(b.levHyd) && isFinite(b.levHyd) ) 
  );

  const elementsOrdered = [...elements].sort((a,b) => (a.variable > b.variable) ? 1 : ((b.variable > a.variable) ? -1 : 0));

  return (
    <div className="App">
      <div className="left">
        <Intro />
        <Copyright className="show-for-large" />
      </div>
      <div className="right">
        <Chart 
          data={visibleBrakes} 
          customData={customBrakes} 
          elements={elements} 
          secondaryElements={secondaryElements}
          loading={status === 'LOADING'} />
        <div className="sidebar">
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
          <Selector 
            title="Some standard brakes" 
            elements={visibleBrakes} 
            toggleData={globalActions.toggleElement}
            stateSelector="brakes" 
            loading={status === 'LOADING'}/>
          <Selector 
            title="Show/hide data" 
            elements={elementsOrdered} 
            secondaryElements={secondaryElements}
            toggleData={globalActions.toggleElement}
            stateSelector="elements"
            secondaryStateSelector="secondaryElements" />
        </div>
      </div>
      <Copyright className="hide-for-large" />
    </div>
  )
}

export default App;
