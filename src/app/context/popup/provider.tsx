"use client";

import React, { useEffect, useState } from "react";
import PopupContext, { defaultPopupState } from "./context";
import type { PopupInput } from "./interface";
import Popup from "@/app/components/layout/Popup";

export default function PopupProvider({ children }: { children: React.ReactNode }) {
  const [popup, setPopupState] = useState(defaultPopupState);

  const setPopup = (popupState: PopupInput) => {
    setPopupState({
      ...popupState,
      isVisible: true,
    });
  };

  useEffect(() => {
      const timer = setTimeout(() => {
        setPopupState(prev => ({ ...prev, isVisible: false }));
      }, 3000);
      return () => clearTimeout(timer);
  }, [popup.isVisible]);

  return (
    <PopupContext.Provider value={{ popup, setPopup }}>
      <Popup />
      {children}
    </PopupContext.Provider>
  );
}