import React, { useEffect, useRef, useState } from "react";

export default function ResponsiveGridWrapper({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(4); // default to 4 cols

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const width = wrapperRef.current.offsetWidth;
        if (width < 640) setCols(2);
        else if (width < 768) setCols(2);
        else if (width < 1024) setCols(2);
        else setCols(4);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (wrapperRef.current) observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={`grid gap-4 grid-cols-${cols}`}>
      {children}
    </div>
  );
}
