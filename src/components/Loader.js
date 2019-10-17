import React from 'react';
import posed, {PoseGroup} from 'react-pose';

const Loader = (props) => (
  <PoseGroup>
    {props.loading && 
      <LoaderPosed className={`loader ${props.position}`} key="loading">
        <Spinner />
      </LoaderPosed>
    }
  </PoseGroup>
);

const Spinner = props => (
  <svg
    className="spinner"
    width={60}
    height={60}
    viewBox="0 0 60 60"
    {...props}
  >
    <circle className="path" fill="none" cx={30} cy={30} r={27} />
  </svg>
);

export default Loader;

const LoaderPosed = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
})