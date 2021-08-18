export function findItem(code, data) {
  return data.find( (el) => el.code === code );
}

export function calculateHydro(caliper, lever) {
  const slaveArea = 2 * (Math.PI * Math.pow(caliper.slave1/2, 2) + Math.PI * Math.pow(caliper.slave2/2, 2));
  const masterArea = Math.PI * Math.pow(lever.master/2, 2);
  return (slaveArea / masterArea) / 2;
}

export function calculateMechAvg(lever) {
  const mechLevAvg = lever.middledistance / lever.max;
  const filledInLeverageAverage =  lever.mechanicalLeverageAverage > 0 && lever.mechanicalLeverageAverage;
  return filledInLeverageAverage ? filledInLeverageAverage : mechLevAvg;
}

export function calculateMechPeak(lever) {
  const mechLevPeak = lever.middledistance / lever.min;
  const filledInLeveragePeak =  lever.mechanicalLeveragePeak > 0 && lever.mechanicalLeveragePeak;
  return filledInLeveragePeak ? filledInLeveragePeak : ( mechLevPeak > 0 && isFinite(mechLevPeak) ? mechLevPeak : 0 );
}

export function calculateTotalAvg(caliper, lever) {
  return calculateHydro(caliper, lever) * calculateMechAvg(lever);
}

export function calculateTotalPeak(caliper, lever) {
  return calculateHydro(caliper, lever) * calculateMechPeak(lever);
}

export function camelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g,
    (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()
  ).replace(/\s+/g, '');
}