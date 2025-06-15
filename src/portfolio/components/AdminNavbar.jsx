import { useState, useEffect } from 'react';
import { usePortfolioStore, useAnchoPantalla } from '../../hooks';

export const AdminNavbar = () => {

  const [activo, setActivo] = useState(false);
  const { empezarEdicion, terminarEdicion } = usePortfolioStore();
  const [modoEdicion, setModoEdicion] = useState(false); //solo para evitar llamadas a terminarEdicion cuando cambia de tamaño
  
  const anchoPantalla = useAnchoPantalla();

  useEffect(() => {
  const nuevoModoEdicion = activo && anchoPantalla > 640;

  if (nuevoModoEdicion !== modoEdicion) {
    setModoEdicion(nuevoModoEdicion);
    nuevoModoEdicion ? empezarEdicion() : terminarEdicion();
  }
}, [activo, anchoPantalla, modoEdicion]);

  return (
    <div className="flex justify-between z-49 sticky top-0 items-center
                    bg-black
                    text-white font-sans font-semibold
                    p-3">
        <h2>
            Administrador
        </h2>

        <div className="flex items-center gap-2">
            <p>Comparte tu portafolio: www.paginaweb/</p>
            <span
                className="bg-white p-2 text-black rounded-sm outline-none"
                role="textbox"
                spellCheck="false"
                contentEditable="true"
                suppressContentEditableWarning={true}
            >
                kevinleichner
            </span>
            <i className="fa-solid fa-copy fa-lg cursor-pointer" />
        </div>

        <button
            disabled = {anchoPantalla < 640}
            onClick={() => setActivo(!activo)}
            className={`flex items-center
                        rounded-full
                        w-16 h-9 p-1 
                        cursor-pointer 
                        transition-colors duration-300
                        ${activo ? 'bg-blue-500' : 'bg-gray-400'}`}
        >
            <div
                className={`flex items-center justify-center
                            bg-white rounded-full shadow-md
                            text-sm 
                            w-7 h-7 
                            transform transition-transform duration-300 
                            ${activo ? 'translate-x-7' : 'translate-x-0'}`}
            >
                <i className={`fa-solid fa-pen 
                                ${anchoPantalla > 640 ? 'text-blue-500' : 'text-gray-500'}`} />
            </div>
        </button>

    </div>
  )
}
