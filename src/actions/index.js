import axios from "axios";
import { sheetId, sheetPage } from "../helpers/url";
import { calculateHydro, calculateMechAvg, calculateMechPeak, calculateTotalAvg, calculateTotalPeak } from '../helpers/calc';

export const getBrakes = async (store, request = axios) => {
  const url = 'https://spreadsheets.google.com/feeds/list/' + sheetId + '/' + sheetPage + '/public/values?alt=json';
  const status = "LOADING";
  store.setState({ status });
  try {
    const response = await request.get(url);
    const responseObj = response.data && response.data.feed && response.data.feed.entry && response.data.feed.entry.map( (el, index) => {
      var keys = Object.keys(el);
      const newRow = keys.map( (key) => {
        const gsxCheck = key.indexOf('gsx$');
        if (gsxCheck > -1) {
          const name = key.substring(4);
          const content = el[key];
          const value = !isNaN(content.$t) ? Number(content.$t) : content.$t;
          return {[name]: value};
        }
        return false;
      });
      const obj = newRow.reduce((obj, item) => {
        const key = item && Object.keys(item);
        return key && {...obj, [key[0]]: item[key[0]]}
      });
      return obj;
    });
    const status = responseObj ? "EMPTY" : "SUCCESS";
    store.setState({ status });

    const data = responseObj.length > 0 ? responseObj.filter( d => d.oil === 'DOT' || d.oil === 'Mineral' ) : [];
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
    store.setState({ brakes, levers, calipers });
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