import { useState, useRef } from "react";

export const useSelectorColor = () => {
  const [mostrarSelectorColor, setMostrarSelectorColor] = useState(false);
  const [posicionSelectorColor, setPosicionSelectorColor] = useState({ top: 0, left: 0 });
  const [colorInicial, setColorInicial] = useState("#ffffff");
  const cambiarColorRef = useRef(() => {});
  const botonColorRef = useRef(null);

  const abrirSelectorColor = (evento, color, onColorChange, opciones = { vertical: "abajo", horizontal: "derecha" }) => {
    const boton = evento.currentTarget;

    if (botonColorRef.current === boton && mostrarSelectorColor) {
      cerrarSelectorColor();
      return;
    }
    
    const rect = boton.getBoundingClientRect();
    const margin = 8;

    const top =
      opciones.vertical === "abajo"
        ? rect.bottom + window.scrollY - 20 + margin
        : rect.top + window.scrollY - 230 - margin;

    const left =
      opciones.horizontal === "derecha"
        ? rect.left + window.scrollX + 20 + margin
        : rect.left + window.scrollX - 210 - margin;

    setPosicionSelectorColor({ top, left });
    setColorInicial(color);
    cambiarColorRef.current = onColorChange;
    botonColorRef.current = boton;
    setMostrarSelectorColor(true);
  };

  const cerrarSelectorColor = () => {
    setMostrarSelectorColor(false);
    botonColorRef.current = null;
  };

  const manejarCambioColor = (nuevoColor) => {
    if (typeof cambiarColorRef.current === "function") {
      cambiarColorRef.current(nuevoColor);
    }
  };

  return {
    mostrarSelectorColor,
    posicionSelectorColor,
    colorInicial,
    botonColorRef,
    abrirSelectorColor,
    cerrarSelectorColor,
    manejarCambioColor,
  };
};
