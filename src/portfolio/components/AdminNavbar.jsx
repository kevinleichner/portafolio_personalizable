import { useState, useEffect, useRef } from 'react';
import { useAnchoPantalla, usePortfolioStore, useAuthStore } from '../../hooks';
import { getVariablesEntorno } from '../../helpers/getVariablesEntorno';
const { VITE_URL_BASE } = getVariablesEntorno();

export const AdminNavbar = ({editar, hayCambios, config}) => {

  const {empezarEdicion, terminarEdicion, empezarGuardarCambios, actualizarConfigLocal} = usePortfolioStore();
  const {empezarDeslogeo, usuario} = useAuthStore();

  const [activo, setActivo] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [guardado, setGuardado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const anchoPantalla = useAnchoPantalla();

  const inputRef = useRef(null);

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

  const actualizarUrl = (nuevaUrl) => {
      actualizarConfigLocal({
        key: 'urlUsuario',
        valor: nuevaUrl
      })
  }

  const manejarGuardado = async () => {
    await empezarGuardarCambios(usuario.uid, config);
    
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const manejarDeslogeo = async () => {
    empezarDeslogeo();
  }

  const copiarURL = () => {
    const base = VITE_URL_BASE;
    const seccion = inputRef.current?.value || "";
    const urlCompleta = base + seccion;

    navigator.clipboard.writeText(urlCompleta)
      .then(() => {
        console.log("URL copiada:", urlCompleta);
      })
      .catch(err => {
        console.error("Error al copiar: ", err);
      });

    setCopiado(true);
    setTimeout(() => setCopiado(false), 1000);
  };

  return (
    <div className={`flex z-49 justify-between sticky top-0 items-center
                    bg-black
                    text-white font-sans font-semibold
                    p-3`}>    

        {anchoPantalla > 640 && (        
          <div className='flex gap-4'>
            <button
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

            <button 
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
          </div>              
        )}

        
        <div className='flex items-center gap-2 text-xs sm:text-base'>
          <p>
           {anchoPantalla < 400 ? "....com/" : VITE_URL_BASE}
          </p>

          <input
            ref={inputRef}
            type="text"
            className="bg-white p-2 text-black rounded-sm outline-none max-w-30 lg:max-w-40 whitespace-nowrap overflow-x-auto
                      overflow-y-hidden hide-scrollbar"
            defaultValue={config.urlUsuario}
            spellCheck="false"
            readOnly={!editar}
            pattern="[a-zA-Z0-9_-]+"
            title="Solo letras, números, guiones y guiones bajos. Sin espacios."
            onBlur={(e) => {
              actualizarUrl(e.currentTarget.value);
              e.currentTarget.scrollTo({ left: 0 });              
            }}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z0-9_-]/g, '');
            }}
          />

          <i className={`${ copiado ? 'fa-check text-green-500' : 'fa-copy cursor-pointer hover:text-pink-400'} m-1 fa-solid fa-lg`}
              onClick={copiarURL} />
        </div>
     
        <button 
            onClick={() => manejarDeslogeo()}       
            className={`flex items-center justify-center
                        rounded-full bg-red-500 cursor-pointer
                        p-1 
                        ${anchoPantalla < 400 
                            ? "w-6 h-6"
                            : "w-9 h-9"
                        }`}
          >
              <i 
              className={'fa-solid fa-right-from-bracket text-sm sm:text-normal'}
              />
          </button>

    </div>
  )
}
