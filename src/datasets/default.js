export const colors = ['#e53935', '#ff7043', '#00796b', '#26a69a', '#5c6bc0', '#fbc02d'];

export const chartDomain = [0,50];

export const standardElements = [
  {variable: 'levTotPeak', name: 'Total peak leverage', color: colors[0], show: true},
  {variable: 'levTotAvg', name: 'Total leverage', color: colors[1], show: true},
  {variable: 'levMecPeak', name: 'Mechanical peak leverage', color: colors[2], show: true},
  {variable: 'levMecAvg', name: 'Mechanical leverage', color: colors[3], show: true},
  {variable: 'levHyd', name: 'Hydraulic leverage', color: colors[4], show: true},
];

export const secondaryElements = [
  {variable: 'totalweight', name: 'Weight', longName: 'Weight per side without hose', color: colors[5], show: true,}
];

export const sortBy = [
  {name: 'Strongest brake first', variable: 'levTotMax'},
  {name: 'Lightest brake first', variable: 'totalweight'},
];