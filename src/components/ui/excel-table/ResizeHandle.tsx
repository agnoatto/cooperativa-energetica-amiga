
import { MouseEvent, useCallback, useEffect, useState } from "react";

interface ResizeHandleProps {
  onResize: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

export function ResizeHandle({ onResize, minWidth = 50, maxWidth = 1000 }: ResizeHandleProps) {
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!isResizing) return;

    const diff = e.pageX - startX;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + diff));
    onResize(newWidth);
  }, [isResizing, startX, startWidth, minWidth, maxWidth, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleMouseDown = (e: MouseEvent) => {
    setIsResizing(true);
    setStartX(e.pageX);
    const cell = (e.target as HTMLElement).closest('th');
    if (cell) {
      setStartWidth(cell.offsetWidth);
    }
  };

  return (
    <div
      className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-blue-400 transition-colors"
      onMouseDown={handleMouseDown}
    />
  );
}
