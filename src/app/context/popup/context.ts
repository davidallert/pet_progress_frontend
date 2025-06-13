"use client";

import { createContext } from "react";

interface PopupState {
  message: string;
  type: string;
  isVisible: boolean;
}

interface PopupContextType {
  popup: PopupState;
  setPopup: React.Dispatch<React.SetStateAction<PopupState>>;
}

export const defaultPopupState = {
  message: '',
  type: '',
  isVisible: false,
};

const PopupContext = createContext<PopupContextType>({
  popup: defaultPopupState,
  setPopup: () => {},
});

export default PopupContext;