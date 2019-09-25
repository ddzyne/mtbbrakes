export function findItem(code, data) {
  return data.find( (el) => el.code === code );
}

export function calculateHydro(lever, caliper) {
  const slaveArea = 2 * (Math.PI * Math.pow(caliper.slave1/2, 2) + Math.PI * Math.pow(caliper.slave2/2, 2));
  const masterArea = Math.PI * Math.pow(lever.master/2, 2);
  return (slaveArea / masterArea) / 2;
}

export function calculateMech(lever) {
  const mechLevAvg = lever.bladeLength / lever.camDistanceMax;
  const mechLevPeak = lever.bladeLength / lever.camDistanceMin;
  return lever.providedLeverage !== 0 ? lever.providedLeverage : 
    (!isNaN(mechLevPeak) && isFinite(mechLevPeak) ? mechLevPeak : mechLevAvg);
}

export function calculateTotal(lever, caliper) {
  return calculateHydro(lever, caliper) * calculateMech(lever);
}