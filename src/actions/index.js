import axios from "axios";
import { url } from "../helpers/url";
import { calculateHydro, calculateMechAvg, calculateMechPeak, calculateTotalAvg, calculateTotalPeak } from '../helpers/calc';

export const getBrakes = async (store, request = axios) => {
  const status = "LOADING";
  store.setState({ status });
  try {
    const response = await request.get(url);
    const data = response.data.rows.filter( d => d.oil === 'DOT' || d.oil === 'Mineral' );
    const brakes = data.map( (b,i) => Object.assign({
      id: `std-brake-${i}`,
      name: `${b.brand} ${ (b.lever === b.caliper || b.caliper.includes(b.lever)) ? b.caliper : b.lever + ' / ' + b.caliper}`,
      levHyd: calculateHydro(b,b),
      levMecAvg: calculateMechAvg(b),
      levMecPeak: calculateMechPeak(b),
      levTotAvg: calculateTotalAvg(b,b),
      levTotPeak: calculateTotalPeak(b,b),
      show: true,
    }, b));
    const isResultsEmpty = brakes.length === 0;
    const status = isResultsEmpty ? "EMPTY" : "SUCCESS";

    const levers = data.filter( (thing, index, self) =>
      thing.mechanicalleverageaverage > 0 &&
      index === self.findIndex((t) => (
        t.lever === thing.lever
      ))
    );

    const calipers = data.filter( (thing, index, self) =>
      thing.slave1 > 0 &&
      index === self.findIndex((t) => (
        t.caliper === thing.caliper
      ))
    );

    store.setState({ brakes, status, levers, calipers });
  } catch (error) {
    console.log(error)
    const isError404 = error.response && error.response.status === 404;
    const status = isError404 ? "NOT_FOUND" : "ERROR";
    store.setState({ status });
  }
};

export const toggleElement = (store, element, stateSelector) => {
  const nextElements = store.state[stateSelector].map( el => {
    if ( element.hasOwnProperty('id') && el.id !== element.id ) return el;
    if ( el.variable !== element.variable ) return el;
    return {
      ...el,
      show: !el.show,
    }
  });
  store.setState({[stateSelector]: nextElements});
}

export const changeValue = (store, type, val) => {
  type === 'lever' ? store.setState({customLever:val}) : store.setState({customCaliper:val});
}

export const addToBrakes = (store) => {
  if( store.state.customLever[0] && store.state.customCaliper[0] ) {
    const customLever = store.state.customLever[0],
          customCaliper = store.state.customCaliper[0];
    const newBrake = {
      id: `cst-brake-${customLever.lever}-${customCaliper.caliper}`,
      name: `${customLever.brand} ${customLever.lever} / ${customCaliper.brand} ${customCaliper.caliper}`,
      levHyd: calculateHydro(customCaliper, customLever),
      levMecAvg: calculateMechAvg(customLever),
      levMecPeak: calculateMechPeak(customLever),
      levTotAvg: calculateTotalAvg(customCaliper,customLever),
      levTotPeak: calculateTotalPeak(customCaliper,customLever),
      show: true,
    }
    const customBrakes = [...store.state.customBrakes, newBrake]
    store.setState({ customBrakes, customCaliper:[], customLever:[] });
  }
}