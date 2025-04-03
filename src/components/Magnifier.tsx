import { useState, useRef } from "react";

interface MagnifierProps {
  imageUrl: string;
}

const Magnifier = ({ imageUrl }: MagnifierProps) => {
  const [zoomStyles, setZoomStyles] = useState({
    "--zoom-x": "0%",
    "--zoom-y": "0%",
    "--display": "none",
    "--url": `url(${imageUrl})`,
  } as React.CSSProperties);

  const imageZoomRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageZoomRef.current) return;

    const { offsetWidth, offsetHeight, offsetLeft, offsetTop } =
      imageZoomRef.current;
    const x = ((event.clientX - offsetLeft) * 100) / offsetWidth;
    const y = ((event.clientY - offsetTop) * 100) / offsetHeight;

    setZoomStyles((prev) => ({
      ...prev,
      "--zoom-x": `${x}%`,
      "--zoom-y": `${y}%`,
      "--display": "block",
    }));
  };

  const handleMouseOut = () => {
    setZoomStyles((prev) => ({ ...prev, "--display": "none" }));
  };

  return (
    <div
      id="imageZoom"
      className="w-full max-h-96 object-cover object-center rounded-lg mx-auto relative cursor-zoom-in"
      ref={imageZoomRef}
      style={
        {
          ...zoomStyles,
          "--url": `url(${imageUrl})`,
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
    >
      <img src={imageUrl} alt="Zoomable" />
    </div>
  );
};

export default Magnifier;
