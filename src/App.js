import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import useGlobal from "./store";
import Chart from './components/Chart';
import { Selector } from './components/Selectors';
import { CustomBuilder } from './components/Input';
import { Intro, Copyright } from './components/Text';
import 'sanitize.css';
import './App.scss';

const App = () => {
  const [globalState, globalActions] = useGlobal();
  const isLarge = useMediaQuery({ query: '(min-width: 1200px)' });

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

  return (
    <div className="App">
      <div className="left">
        <Intro isLarge={isLarge} />
        { isLarge && <Copyright /> }
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
              title="Build your own brake" 
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
          <div className="default-brakes"> 
            <Selector 
              title="Some standard brakes" 
              elements={visibleBrakes.filter( e => e.display === 'Y' )} 
              toggleData={globalActions.toggleElement}
              stateSelector="brakes" 
              loading={status === 'LOADING'}/>
            <Selector 
              title="Older brakes" 
              elements={visibleBrakes.filter( e => e.display !== 'Y' )} 
              toggleData={globalActions.toggleElement}
              stateSelector="brakes" 
              loading={status === 'LOADING'}/>
          </div>
        </div>
      </div>
      { !isLarge && <Copyright /> }
    </div>
  )
}

export default App;
