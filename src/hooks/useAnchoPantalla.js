import {useEffect, useState} from 'react'

export const useAnchoPantalla = () => {
    const [ancho, setAncho] = useState(window.innerWidth);

    useEffect(() => {
        const manejarCambioAncho = () => setAncho(window.innerWidth);
        window.addEventListener('resize', manejarCambioAncho);
        manejarCambioAncho(); 
        return () => window.removeEventListener('resize', manejarCambioAncho);
    }, []);

    return ancho;
}