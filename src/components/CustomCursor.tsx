"use client";

import { useCustomCursor } from "@/hooks/useCustomCursor";
import { createContext, useContext, useCallback } from "react";

interface CursorContextType {
  onCursorEnter: () => void;
  onCursorLeave: () => void;
}

const CursorContext = createContext<CursorContextType>({
  onCursorEnter: () => {},
  onCursorLeave: () => {},
});

export const useCursorContext = () => useContext(CursorContext);

export default function CustomCursor() {
  const { cursorRef, ringRef, isHovering, onCursorEnter, onCursorLeave } =
    useCustomCursor();

  return (
    <CursorContext.Provider value={{ onCursorEnter, onCursorLeave }}>
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? "hovering" : ""}`}
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isHovering ? "hovering" : ""}`}
      />
    </CursorContext.Provider>
  );
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const { cursorRef, ringRef, isHovering, onCursorEnter, onCursorLeave } =
    useCustomCursor();

  return (
    <CursorContext.Provider value={{ onCursorEnter, onCursorLeave }}>
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? "hovering" : ""}`}
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isHovering ? "hovering" : ""}`}
      />
      {children}
    </CursorContext.Provider>
  );
}
