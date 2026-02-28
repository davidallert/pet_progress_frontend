interface PopupState {
  messages: Array<string>;
  type: string;
  isVisible: boolean;
}

interface PopupContextType {
  popup: PopupState;
  setPopup: React.Dispatch<React.SetStateAction<PopupState>>;
}

export type { PopupState, PopupContextType }