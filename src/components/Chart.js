import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from './Loader';

const Chart = (props) => {
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
          layout="vertical">
          <CartesianGrid strokeDasharray="2 2" stroke="#f1f1f1"/>
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#f1f1f1" 
            tick={{fontSize: 11}}/>
          <XAxis 
            stroke="#f1f1f1" 
            type="number"
            domain={[0, 60]} 
            allowDataOverflow={false} 
            allowDecimals={false}
            ticks={[0,10,20,30,40,50,60,70]} />
          <Tooltip cursor={{fill: 'rgba(255,255,255,.3)'}} content={<CustomTooltip/>} />
          <Legend content={<CustomLegend/>}/>
          {elements.map( (el) =>
            el.show && 
            <Bar 
              stackId={
                el.variable === 'levMecPeak' || el.variable === 'levMecAvg' ? 'a' :
                (el.variable === 'levTotPeak' || el.variable === 'levTotAvg' ? 'b' : null )} 
              key={el.variable} 
              dataKey={el.variable} 
              name={el.name} 
              fill={el.color}
              shape={<CustomBar/>}
               />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart;

const CustomTooltip = ({ payload, label, active }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <h4 className="label">{label ? `${label}` : ''}</h4>
        {payload && payload.map( (el, i) =>
          <div key={i}>
            <h6>{`${el.name}`}</h6>
            <p>{`${el.value.toFixed(3)}`}</p>
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
  const { background, x, fill, y, width, height } = props;
  return <path 
    fill={fill}
    d={getPath(x > background.x ? background.x : x,y,width,height)}
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