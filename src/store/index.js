import React from "react";
import useGlobalHook from "use-global-hook";

import * as actions from "../actions";

import {standardElements, secondaryElements} from '../datasets/default';

const initialState = {
  brakes: [],
  elements: standardElements,
  secondaryElements: secondaryElements,
  customBrakes: [],
  customLever: [],
  customCaliper: [],
  levers: [],
  calipers: [],
  status: 'LOADING',
  sortBy: '',
};

const useGlobal = useGlobalHook(React, initialState, actions);

export default useGlobal;