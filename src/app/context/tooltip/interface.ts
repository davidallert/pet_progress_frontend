interface TooltipState {
  text: string;
  isVisible: boolean;
}

interface TooltipContextType {
  tooltip: TooltipState;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
}

export type { TooltipState, TooltipContextType }