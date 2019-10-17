import React from "react";
import useGlobalHook from "use-global-hook";

import * as actions from "../actions";

import {standardElements} from '../datasets/default';

const initialState = {
  brakes: [],
  elements: standardElements,
  customBrakes: [],
  customLever: [],
  customCaliper: [],
  levers: [],
  calipers: [],
  status: 'LOADING',
};

const useGlobal = useGlobalHook(React, initialState, actions);

export default useGlobal;