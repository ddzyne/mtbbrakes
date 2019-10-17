import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from './Loader';

class Chart extends React.Component {
  state = {
    stacked: false,
  }
  render() {
    const {data,elements,loading} = this.props;
    const {stacked} = this.state;
    const fullData = data.concat(this.props.customData).filter( d => d.show );
    return (
      <div className="chart-wrap">
        <Loader loading={loading} position="absolute"/>
        <ResponsiveContainer width="100%" height={1200}>
          <BarChart
            data={fullData}
            margin={{top: 0, right: 0, left: 0, bottom: 0,}}
            barGap={0}
            layout="vertical"
            >
            <CartesianGrid strokeDasharray="2 2" stroke="#f1f1f1"/>
            <YAxis type="category" dataKey="name" stroke="#f1f1f1" tick={{fontSize: 11}} />
            <XAxis stroke="#f1f1f1" type="number" />
            <Tooltip cursor={{fill: 'rgba(255,255,255,.3)'}} content={<CustomTooltip/>} />
            <Legend />
            {elements.map( (el, i) =>
              el.show && 
              <Bar 
                stackId={stacked ? 'a' : null} 
                key={el.variable} 
                dataKey={el.variable} 
                name={el.name} 
                fill={el.color} />
            )}
          </BarChart>
        </ResponsiveContainer>
       {/* <ElementSelector 
          name={stacked ? "Unstack bars" : "Stack bars" }
          onClick={()=>this.setState({stacked:!stacked})}
          visible={stacked}/>*/}
      </div>
    )
  }
}

export default Chart;

function CustomTooltip({ payload, label, active }) {
  if (active) {
    return (
      <div className="custom-tooltip">
        <h4 className="label">{label ? `${label}` : ''}</h4>
        {payload && payload.map( (el, i) =>
          el.value > 0 &&
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