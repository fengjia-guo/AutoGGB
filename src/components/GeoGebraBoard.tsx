import { useRef, useEffect } from "react";

export default function GeoGebraBoard() {
  const containerRef = useRef<HTMLDivElement>(null);

  const loadGGB = () => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const app = new (window as any).GGBApplet(
      {
        appName: "geometry",
        showToolBar: true,
        showMenuBar: true,
        width,
        height,
      },
      true
    );
    app.inject("ggb-element");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.geogebra.org/apps/deployggb.js";
    script.onload = () => {
      loadGGB();
      window.addEventListener("resize", loadGGB);
    };
    document.body.appendChild(script);
    return () => window.removeEventListener("resize", loadGGB);
  }, []);

  return <div ref={containerRef} id="ggb-element" className="w-full h-full" />;
}
