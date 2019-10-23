import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from './Loader';
import { standardElements, chartDomain } from '../datasets/default';
import {ElementSelector} from './Selectors';

const Chart = (props) => {
  const [stacked, setStacked] = useState(true);
  const {data, elements, loading} = props;
  const fullData = data.concat(props.customData).filter( d => d.show );
  return (
    <div className="chart-wrap">
      <Loader loading={loading} position="absolute"/>
      <ResponsiveContainer width="100%" height={1200}>
        <BarChart
          data={fullData}
          margin={{top: 0, right: 0, left: 0, bottom: 0,}}
          barGap={0}
          layout="vertical"
          barCategoryGap="15%">
          <CartesianGrid strokeDasharray="2 2" stroke="#f1f1f1"/>
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#f1f1f1" 
            tick={{fontSize: 11}}/>
          <XAxis 
            stroke="#f1f1f1" 
            type="number"
            domain={chartDomain} 
            allowDataOverflow={true} 
            allowDecimals={false}
            ticks={[0,10,20,30,40,50]} />
          <Tooltip cursor={{fill: 'rgba(255,255,255,.3)'}} content={<CustomTooltip/>} />
          <Legend content={<CustomLegend/>}/>
          {elements.map( (el) =>
            el.show && 
            <Bar 
              stackId={stacked ? 'a' :
                (el.variable === 'levMecPeak' || el.variable === 'levMecAvg' ? 'a' :
                (el.variable === 'levTotPeak' || el.variable === 'levTotAvg' ? 'b' : null ))
              } 
              key={el.variable} 
              dataKey={el.variable} 
              name={el.name} 
              fill={el.color}
              shape={<CustomBar/>} />
          )}
        </BarChart>
      </ResponsiveContainer>
      <ElementSelector 
          name={stacked ? "Unstack bars" : "Stack bars" }
          onClick={()=>setStacked(!stacked)}
          visible={stacked}/>
    </div>
  )
}

export default Chart;

const CustomTooltip = ({ payload, label, active }) => {
  const payloadOrdered = payload.sort((a,b) => (a.dataKey > b.dataKey) ? 1 : ((b.dataKey > a.dataKey) ? -1 : 0)); 
  if (active) {
    return (
      <div className="custom-tooltip">
        <h4 className="label">{label ? `${label}` : ''}</h4>
        {payloadOrdered && payloadOrdered.map( (el, i) =>
          <div key={i} className="item-wrap">
            <span className="color" style={{'backgroundColor': el.color}}/>
            <div>
              <h6>{`${el.name}`}</h6>
              <p>{`${el.value.toFixed(3)}`}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
}

const getPath = (x, y, width, height) => {
  return `M ${x},${y} h ${width} v ${height} h ${-width} Z`;
};

const CustomBar = (props) => {
  const { background, x, fill, y, width, height, value, payload } = props;
  //manual width calculation, it's dirty, but needed to get better chart scaling, allowing data overflow without clipping, and stacked bars starting from 0
  const theElement = standardElements.find( el => el.color === fill);
  const newWidth = payload[theElement.variable] * (background.width / chartDomain[1]);
  return <path 
    fill={fill}
    d={getPath(x > background.x ? background.x : x,y,newWidth,height)}
    />;
};

const CustomLegend = (props) => {
  const { payload } = props;
  const payloadOrdered = payload.sort((a,b) => (a.dataKey > b.dataKey) ? 1 : ((b.dataKey > a.dataKey) ? -1 : 0)); 
  return (
    <div className="legend">
      {
        payloadOrdered.map((entry, index) => (
          <span className="item" key={`item-${index}`}>
            <span className="color" style={{'backgroundColor': entry.color}}/>
            <span className="label">{entry.value}</span>
          </span>
        ))
      }
    </div>
  );
}