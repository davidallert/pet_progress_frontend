"use client";

import React, { useState, useEffect } from "react";
import TooltipContext, { defaultTooltipState } from "./context";
import Tooltip from "@/app/components/ui/Tooltip";

export default function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [tooltip, setTooltip] = useState(defaultTooltipState);

    useEffect(() => {
        const timer = setTimeout(() => {
          setTooltip(prev => ({ ...prev, isVisible: false }));
        }, 3000);
        return () => clearTimeout(timer);
    }, [tooltip.isVisible]);

  return (
    <TooltipContext.Provider value={{ tooltip, setTooltip }}>
      <Tooltip />
      {children}
    </TooltipContext.Provider>
  );
}