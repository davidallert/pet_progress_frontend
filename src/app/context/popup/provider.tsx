"use client";

import React, { useEffect, useState } from "react";
import PopupContext, { defaultPopupState } from "./context";
import Popup from "@/app/components/popup";

export default function PopupProvider({ children }: { children: React.ReactNode }) {
  const [popup, setPopup] = useState(defaultPopupState);

  useEffect(() => {
      const timer = setTimeout(() => {
        setPopup(prev => ({ ...prev, isVisible: false }));
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