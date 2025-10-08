import {useEffect, useState} from 'react'

export const useAnchoPantalla = () => {
  const obtenerAncho = () =>
    document.documentElement.clientWidth || window.innerWidth;

  const [ancho, setAncho] = useState(obtenerAncho());

  useEffect(() => {
    const manejarCambioAncho = () => setAncho(obtenerAncho());

    window.addEventListener('resize', manejarCambioAncho);
    window.addEventListener('orientationchange', manejarCambioAncho);

    manejarCambioAncho();

    return () => {
      window.removeEventListener('resize', manejarCambioAncho);
      window.removeEventListener('orientationchange', manejarCambioAncho);
    };
  }, []);

  return ancho;
};