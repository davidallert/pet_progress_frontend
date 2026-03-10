interface TooltipState {
  text: string;
  isVisible: boolean;
  x: number;
  y: number;
}

interface TooltipContextType {
  tooltip: TooltipState;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
}

export type { TooltipState, TooltipContextType }