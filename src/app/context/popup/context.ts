"use client";

import { createContext } from "react";
import { PopupState, PopupContextType } from "./interface";

export const defaultPopupState: PopupState = {
  messages: [],
  type: '',
  isVisible: false,
};

const PopupContext = createContext<PopupContextType>({
  popup: defaultPopupState,
  setPopup: () => {},
});

export default PopupContext;