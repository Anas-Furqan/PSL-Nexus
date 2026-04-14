  "use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CursorState {
  x: number;
  y: number;
  ringX: number;
  ringY: number;
  isHovering: boolean;
}

export function useCustomCursor() {
  const [state, setState] = useState<CursorState>({
    x: 0,
    y: 0,
    ringX: 0,
    ringY: 0,
    isHovering: false,
  });

  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animateRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      animRef.current = requestAnimationFrame(animateRing);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animRef.current = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const onCursorEnter = useCallback(() => {
    setState((s) => ({ ...s, isHovering: true }));
  }, []);

  const onCursorLeave = useCallback(() => {
    setState((s) => ({ ...s, isHovering: false }));
  }, []);

  return {
    cursorRef,
    ringRef,
    isHovering: state.isHovering,
    onCursorEnter,
    onCursorLeave,
  };
}
