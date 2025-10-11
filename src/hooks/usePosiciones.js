import React from 'react';
import { useRef, useState, useEffect } from 'react';

export const usePosiciones = (totalItems, shouldObserve) => {
    const refs = useRef([]);
    refs.current = Array(totalItems).fill(null).map((_, i) => refs.current[i] || React.createRef());

    //'izquierda' | 'derecha' | 'centro'}
    const [posiciones, setPosiciones] = useState({}); 

    const calcularPosiciones = () => {
        if (!shouldObserve || totalItems === 0) {
            setPosiciones({});
            return;
        }
        
        const nuevasPosiciones = {};

        const elements = refs.current
            .map(ref => ref.current)
            .filter(el => el);

        if (elements.length === 0) return;

        let filaActual = [];

        let currentY = elements[0].offsetTop;

        elements.forEach((el, i) => {
            const elY = el.offsetTop;

            if (elY === currentY) {
                filaActual.push({ el, index: i });
            } else {
                procesarFila(filaActual, nuevasPosiciones);
                
                filaActual = [{ el, index: i }];
                currentY = elY;
            }
        });

        procesarFila(filaActual, nuevasPosiciones);
        
        setPosiciones(nuevasPosiciones);
    };

    const procesarFila = (row, nuevasPosiciones) => {
        if (row.length > 0) {
            // Elemento izquierdo (el primero de la fila)
            nuevasPosiciones[row[0].index] = 'izquierda';
            
            if (row.length > 1) {
                // Elemento derecho (el último de la fila)
                nuevasPosiciones[row[row.length - 1].index] = 'derecha';
                
                // Elementos centrales
                for (let j = 1; j < row.length - 1; j++) {
                    nuevasPosiciones[row[j].index] = 'centro'; 
                }
            }
        }
    };

    useEffect(() => {
        calcularPosiciones();
        
        window.addEventListener('resize', calcularPosiciones);
        
        return () => window.removeEventListener('resize', calcularPosiciones);
        
    }, [totalItems, shouldObserve]);

    const obtenerPosicionHorizontal = (index) => {
        return posiciones[index] || 'centro'; // Devuelve 'centro' si no se ha calculado (ej: durante la carga)
    };

    return { refs, obtenerPosicionHorizontal };
};