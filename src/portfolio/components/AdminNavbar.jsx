import { useState, useEffect } from 'react';
import { useAnchoPantalla, usePortfolioStore } from '../../hooks';

export const AdminNavbar = ({editar, hayCambios}) => {

  const {empezarEdicion, terminarEdicion, guardarCambios} = usePortfolioStore();

  const [activo, setActivo] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); //solo para evitar llamadas a terminarEdicion cuando cambia de tamaño

  const [guardado, setGuardado] = useState(false);

  const anchoPantalla = useAnchoPantalla();

  useEffect(() => {
    const nuevoModoEdicion = activo && anchoPantalla > 640;

    if (nuevoModoEdicion !== modoEdicion) {
      setModoEdicion(nuevoModoEdicion);
      nuevoModoEdicion ? empezarEdicion() : terminarEdicion();
    }
  }, [activo, anchoPantalla, modoEdicion]);

  useEffect(() => {
    if (hayCambios) {
      setGuardado(false);
    }
  }, [hayCambios]);

  const manejarGuardado = async () => {
    await guardarCambios();
    
    setGuardado(true);

    setTimeout(() => setGuardado(false), 2000);
  };

  return (
    <div className={`flex z-49 justify-center sticky top-0 items-center
                    bg-black
                    text-white font-sans font-semibold
                    p-3
                    sm:justify-between`}>                  
        <h2 hidden = {anchoPantalla < 800}>
            Administrador
        </h2>

        <div className='flex items-center gap-2 text-xs
                        sm:text-base'>
            <p><span className={`${anchoPantalla < 400 && 'hidden'}`}>Comparte tu portafolio: </span>www.paginaweb/</p>
            <span
                className="bg-white p-2 text-black rounded-sm outline-none"
                role="textbox"
                spellCheck="false"
                contentEditable={editar}
                suppressContentEditableWarning={true}
            >
                kevinleichner
            </span>
            <i className="fa-solid fa-copy fa-lg cursor-pointer" />
        </div>

        <div className='flex gap-4'>
            <button
              disabled = {anchoPantalla < 640}
              hidden = {anchoPantalla < 640}  
              onClick={() => hayCambios && manejarGuardado()}       
              className={`flex items-center justify-center
                          rounded-full
                          transition-colors duration-200
                         ${
                            guardado
                              ? 'bg-green-500'
                              : hayCambios
                              ? 'bg-blue-500 cursor-pointer'
                              : 'bg-gray-400'
                          }
                          w-9 h-9 p-1 `}
            >
                <i 
                className={`${
                            guardado
                              ? 'fa-solid fa-circle-check'
                              : 'fa-regular fa-floppy-disk'
                          }`}
                />
            </button>        

          <button
              disabled = {anchoPantalla < 640}
              hidden = {anchoPantalla < 640}
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

    </div>
  )
}
