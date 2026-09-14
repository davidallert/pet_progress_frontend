interface PopupState {
  messages: Array<string>;
  type: string;
  isVisible: boolean;
}

type PopupInput = Omit<PopupState, "isVisible"> & Partial<Pick<PopupState, "isVisible">>;

interface PopupContextType {
  popup: PopupState;
  setPopup: (popup: PopupInput) => void;
}

export type { PopupState, PopupInput, PopupContextType };