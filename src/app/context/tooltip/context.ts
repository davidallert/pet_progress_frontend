"use client";

import { createContext } from "react";
import { TooltipState, TooltipContextType } from "./interface";

export const defaultTooltipState: TooltipState = {
  text: '',
  isVisible: false,
  x: 0,
  y: 0
};

const TooltipContext = createContext<TooltipContextType>({
  tooltip: defaultTooltipState,
  setTooltip: () => {},
});

export default TooltipContext;