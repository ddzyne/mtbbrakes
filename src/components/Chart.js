import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Text, Rectangle } from 'recharts';
import { FadeLoader } from './Loader';
import { chartDomain, colors } from '../datasets/default';
import { Sort } from './Input';
import useGlobal from "../store";

const Chart = (props) => {
  const [ globalState ] = useGlobal();
  const { sortBy } = globalState;
  const { data, elements, secondaryElements, loading } = props;
  const fullData = data.concat(props.customData).filter( d => d.show );
  const dataOrdered = sortBy !== '' ? 
    [...fullData].sort((a,b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0)) : 
    fullData;
  return (
    <div className="chart-wrap">
      <FadeLoader loading={loading} className="loader absolute"/>
      <Sort />
      <ResponsiveContainer width="100%" height={1200}>
        <BarChart
          data={dataOrdered}
          margin={{top: 10, right: 0, left: 0, bottom: 0}}
          barGap={0}
          layout="vertical"
          barCategoryGap="15%">
          <CartesianGrid strokeDasharray="2 2" stroke="#f1f1f1"/>
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#f1f1f1"
            width={100}
            tickMargin={5}
            tick=<CustomizedTick/> />
          <XAxis 
            stroke={colors[1]} 
            type="number"
            domain={chartDomain} 
            allowDataOverflow={true} 
            allowDecimals={false}
            ticks={[0,10,20,30,40,50]}
            xAxisId="top" 
            orientation="top">
            <Label value="Leverage" offset={0} position="top" />
          </XAxis>
          <XAxis 
            stroke={colors[5]} 
            type="number"
            allowDecimals={false}
            xAxisId="bottom" 
            orientation="bottom">
            <Label value="Weight per side without hose (g)" offset={0} position="bottom" />
          </XAxis>
          <Tooltip cursor={{fill: 'rgba(255,255,255,.3)'}} content={<CustomTooltip fullData={fullData} />} />
          <Legend content={<CustomLegend/>}/>
          {elements.map( (el) => ( 
            <Bar 
              key={el.variable} 
              dataKey={el.variable} 
              name={el.name} 
              fill={el.color}
              hide={!el.show}
              shape={<CustomBar otherVisible={ secondaryElements.find(e => e.show) ? true : false } />}
              xAxisId="top"
              barSize={ 0 }/>
            )
          )}
          {secondaryElements.map( (el) =>  (
            <Bar 
              key={el.variable} 
              dataKey={el.variable}
              name={el.longName ? el.longName : el.name}
              fill={el.color}
              hide={!el.show}
              shape={<RoundedBar otherVisible={ elements.find(e => e.show) ? true : false } />}
              xAxisId="bottom"
              barSize={elements.find(e => e.show) ? 10 : 35} />
            )
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart;

const CustomTooltip = ({ payload, label, active, fullData }) => {
  const payloadOrdered = payload.sort((a,b) => (a.dataKey > b.dataKey) ? 1 : ((b.dataKey > a.dataKey) ? -1 : 0)); 
  const name = label ? ( label.toString().indexOf(' (custom)') !== -1 ? label.replace(' (custom)', '') : label ) : '';
  const allBrakeData = fullData.length > 0 && fullData.find( e => e.name === label );
  if (active) {
    return (
      <div className="custom-tooltip">
        <h4 className="label">{name}</h4>
        {payloadOrdered && payloadOrdered.map( (el, i) =>
          <div key={i} className="item-wrap">
            <span className="color" style={{'backgroundColor': el.color}}/>
            <div>
              <h6>{`${el.name}`}</h6>
              <p>{el.dataKey === 'totalWithoutHose' ? (el.value > 0 ? `${el.value} g` : 'N/A') : `${parseFloat(el.value).toFixed(2)}`}</p>
            </div>
          </div>
        )}
        {allBrakeData.notes &&
          <div className="item-wrap">
            <div>
              <h6>Notes</h6>
              <p>{allBrakeData.notes}</p>
            </div>
          </div>
        }
      </div>
    );
  }
  return null;
}

const CustomizedTick = ({ x, y, payload }) => {
  const custom = payload.value.toString().indexOf(' (custom)') !== -1;
  const label = custom ? payload.value.replace(' (custom)', '') : payload.value;
  return (
    <Text 
      angle={-35}
      x={x}
      y={y}
      textAnchor="end"
      verticalAnchor="middle"
      fill={custom ? '#ff2b2b' : '#fff'} 
      fontSize={12}
      width={135}
    >
      {label}
    </Text>
  )
}

const CustomBar = ({ background, x, fill, y, height, width, payload, hide, otherVisible }) => {
  return (
    <Rectangle 
      fill={fill}
      x={x > background.x ? background.x : x}
      y={otherVisible ? y - 10 : y - 17}
      height={otherVisible ? 25 : 35}
      width={width}
      radius={[0, 3, 3, 0]}
    />
  )
};

const RoundedBar = ({ x, fill, y, height, width, otherVisible }) => {
  return (
    <Rectangle 
      fill={fill}
      x={x}
      y={otherVisible ? y + 15 : y}
      height={height}
      width={width}
      radius={[0, 3, 3, 0]}
    />
  )
};

const CustomLegend = ({ payload }) => {
  const [globalState, globalActions] = useGlobal();
  const payloadOrdered = payload.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0)); 
  return (
    <div className="legend">
      {
        payloadOrdered.map((entry, index) => (
          <span 
            className={`item ${entry.inactive ? 'disabled' : 'enabled'}`} 
            key={`item-${index}`}
            style={{'backgroundColor': entry.color}}
            onClick={() => 
              globalActions.toggleElement(entry, entry.value.toLowerCase().includes('weight') ? 'secondaryElements' : 'elements')}
          >
            <span className="label">{entry.value}</span>
          </span>
        ))
      }
    </div>
  );
};