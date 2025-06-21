import { HexColorPicker } from "react-colorful";
import { useState, useEffect, useRef } from "react";
import Portal from "./Portal";

export const SelectorColor = ({
  colorInicial = "#ffffff",
  manejarCambioColor,
  top,
  left,
  manejarClickAfuera,
  botonColorRef
}) => {
  const [color, setColor] = useState(colorInicial);
  const contenedorRef = useRef();

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(e.target) &&
        botonColorRef &&
        !botonColorRef.contains(e.target)
      ) {
        manejarClickAfuera?.();
      }
    };

    document.addEventListener("mousedown", handleClickFuera);
    return () => {
      document.removeEventListener("mousedown", handleClickFuera);
    };
  }, [manejarClickAfuera, botonColorRef]);

  useEffect(() => {
    setColor(colorInicial);
  }, [colorInicial]);

  const handleChange = (nuevoColor) => {
    setColor(nuevoColor);
    manejarCambioColor(nuevoColor);
  };

  return (
    <Portal>
      <div
        ref={contenedorRef}
        className="flex flex-col items-center gap-2 p-2 rounded-md bg-white shadow z-[9999]"
        style={{ position: "absolute", top, left }}
      >
        <HexColorPicker color={color} onChange={handleChange} />
        <input
          type="text"
          value={color}
          onChange={(e) => handleChange(e.target.value)}
          className="border rounded px-2 py-1 text-center w-[120px]"
        />
      </div>
    </Portal>
  );
};
