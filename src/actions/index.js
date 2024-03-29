import axios from "axios";
import { googleUrl, sheetId, sheetPage } from "../helpers/url";
import { camelCase } from "../helpers/calc";
import { calculateHydro, calculateMechAvg, calculateMechPeak, calculateTotalAvg, calculateTotalPeak } from '../helpers/calc';

export const getBrakes = async (store, request = axios) => {
  const url = googleUrl + sheetId + '/values/' + sheetPage + '?key=' + process.env.REACT_APP_API_KEY;
  try {
    const response = await request.get(url);
    const responseObj = response.data && response.data.values && response.data.values.map( 
      (el, index) => {
        // headers are the 3rd row in the Google sheet
        const arr = response.data.values[2].map( (header, i) => { 
          return { [camelCase(header)]: el[i] } 
        });
        return arr.reduce((obj, item) => {
          const key = item && Object.keys(item);
          return key && {...obj, [key[0]]: item[key[0]]}
        });
    });

    const status = responseObj.length === 0 ? "EMPTY" : "SUCCESS";
    const data = responseObj.length > 0 ? responseObj.filter( d => d.oil === 'DOT' || d.oil === 'Mineral' ) : [];
    const brakes = data.map( ( b, i ) => Object.assign({
      id: `std-brake-${i}`,
      name: `${b.brand} ${ (b.lever === b.caliper || b.caliper.includes(b.lever)) ? b.caliper : b.lever + ' / ' + b.caliper}`,
      levHyd: calculateHydro(b,b),
      levMecAvg: calculateMechAvg(b),
      ...( calculateMechPeak(b) > 0 && {levMecPeak: calculateMechPeak(b)}),
      levTotAvg: calculateTotalAvg(b,b),
      ...( calculateTotalPeak(b,b) > 0 && {levTotPeak: calculateTotalPeak(b,b)}),
      levTotMax: -1 * ( calculateTotalPeak(b,b) > 0 ? calculateTotalPeak(b,b) : calculateTotalAvg(b,b) ),
      levHydSort: -1 * calculateHydro(b, b),
      levMecSort: -1 * ( calculateMechPeak(b) > 0 ? calculateMechPeak(b) : calculateMechAvg(b) ),
      show: b.display === 'Y',
      custom: false,
    }, b )).sort( (a, b) => a.name > b.name );

    const levers = brakes.filter( (thing, index, self) =>
      thing.mechanicalLeverageAverage > 0 && index === self.findIndex( t => t.lever === thing.lever )
    );

    const calipers = brakes.filter( (thing, index, self) =>
      thing.slave1 > 0 && index === self.findIndex( t => t.caliper === thing.caliper )
    );
    store.setState({ brakes, levers, calipers, status });

    return store;
  }
  catch (error) {
    console.log(error);
    const isError404 = error.response && error.response.status === 404;
    const status = isError404 ? "NOT_FOUND" : "ERROR";
    store.setState({ status });
  }
};

export const toggleElement = (store, element, stateSelector) => {
  const nextElements = store.state[stateSelector].map( el => {
    if ( element.hasOwnProperty('id') && el.id !== element.id ) return el;
    if ( el.variable !== element.variable && el.variable !== element.dataKey ) return el;
    return {
      ...el,
      show: !el.show,
    }
  });
  store.setState({ [stateSelector]: nextElements });
}

export const changeValue = (store, type, val) => {
  type === 'lever' ? store.setState({ customLever: val }) : store.setState({ customCaliper: val });
}

export const addToBrakes = (store) => {
  if( store.state.customLever[0] && store.state.customCaliper[0] ) {
    const customLever = store.state.customLever[0],
          customCaliper = store.state.customCaliper[0];
    const newBrake = {
      id: `cst-brake-${customLever.lever}-${customCaliper.caliper}`,
      name: `${customLever.brand} ${customLever.lever} / ${customCaliper.brand} ${customCaliper.caliper} (custom)`,
      levHyd: calculateHydro(customCaliper, customLever),
      levMecAvg: calculateMechAvg(customLever),
      levMecPeak: calculateMechPeak(customLever),
      levTotAvg: calculateTotalAvg(customCaliper,customLever),
      levTotPeak: calculateTotalPeak(customCaliper,customLever),
      levTotMax: -1 * ( calculateTotalPeak(customCaliper,customLever) > 0 ? calculateTotalPeak(customCaliper,customLever) : calculateTotalAvg(customCaliper,customLever) ),
      levHydSort: -1 * calculateHydro(customCaliper, customLever),
      levMecSort: -1 * ( calculateMechPeak(customLever) > 0 ? calculateMechPeak(customLever) : calculateMechAvg(customLever) ),
      show: true,
      custom: true,
      oilCompatible: customCaliper.oil === customLever.oil,
    };
    const customBrakes = [...store.state.customBrakes, newBrake];
    store.setState({ customBrakes, customCaliper: [], customLever: [] });
  }
}

export const sortData = (store, data) => {
  const sortBy = data[0].variable;
  store.setState({ sortBy });
}