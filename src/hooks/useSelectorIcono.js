import { useState, useRef, useEffect } from "react";

export const useSelectorIcono = () => {
  const [mostrarSelectorIcono, setMostrarSelectorIcono] = useState(false);
  const [posicionSelectorIcono, setPosicionSelectorIcono] = useState({ top: 0, left: 0 });
  const [indiceRedSocialActiva, setIndiceRedSocialActiva] = useState(null);

  const botonIconoRef = useRef(null);
  const selectorIconoRef = useRef(null);
  const manejarSeleccionRef = useRef(() => {});
  
  const abrirSelectorIcono = (
    evento,
    indice,
    manejarSeleccionIcono,
    opciones = { vertical: "abajo", horizontal: "derecha" }
  ) => {
    const boton = evento.currentTarget;

    if (botonIconoRef.current === boton && mostrarSelectorIcono) {
      cerrarSelectorIcono();
      return;
    }

    const rect = boton.getBoundingClientRect();
    const margin = 8;

    const top =
      opciones.vertical === "abajo"
        ? rect.bottom + window.scrollY - 160 + margin
        : rect.top + window.scrollY - 345 - margin;

    const left =
      opciones.horizontal === "derecha"
        ? rect.left + window.scrollX + 20 + margin
        : rect.left + window.scrollX - 198 - margin;

    setPosicionSelectorIcono({ top, left });
    setIndiceRedSocialActiva(indice);
    manejarSeleccionRef.current = manejarSeleccionIcono;
    botonIconoRef.current = boton;
    setMostrarSelectorIcono(true);
  };

  const cerrarSelectorIcono = () => {
    setMostrarSelectorIcono(false);
    botonIconoRef.current = null;
    setIndiceRedSocialActiva(null);
  };

  const manejarSeleccionIcono = (icono) => {
    if (typeof manejarSeleccionRef.current === "function") {
      manejarSeleccionRef.current(icono);
    }
  };

  useEffect(() => {
    const clickFuera = (e) => {
      if (
        mostrarSelectorIcono &&
        selectorIconoRef.current &&
        !selectorIconoRef.current.contains(e.target) &&
        !botonIconoRef.current?.contains(e.target)
      ) {
        cerrarSelectorIcono();
      }
    };

    document.addEventListener("mousedown", clickFuera);
    return () => document.removeEventListener("mousedown", clickFuera);
  }, [mostrarSelectorIcono]);

  return {
    mostrarSelectorIcono,
    posicionSelectorIcono,
    botonIconoRef,
    selectorIconoRef,
    indiceRedSocialActiva,
    abrirSelectorIcono,
    cerrarSelectorIcono,
    manejarSeleccionIcono,
  };
};
