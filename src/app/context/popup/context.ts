"use client";

import { createContext } from "react";

interface PopupState {
  messages: Array<string>;
  type: string;
  isVisible: boolean;
}

interface PopupContextType {
  popup: PopupState;
  setPopup: React.Dispatch<React.SetStateAction<PopupState>>;
}

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