import { useState, useEffect, useRef } from 'react';
import { useAnchoPantalla, usePortfolioStore, useAuthStore } from '../../hooks';
import { getVariablesEntorno } from '../../helpers/getVariablesEntorno';
import Swal from 'sweetalert2';
const { VITE_URL_BASE } = getVariablesEntorno();

export const AdminNavbar = ({editar, hayCambios, config}) => {

  const {empezarEdicion, terminarEdicion, empezarGuardarCambios, empezarDeshacerCambios, actualizarConfigLocal, configLocal} = usePortfolioStore();
  const {empezarDeslogeo, usuario} = useAuthStore();

  const [activo, setActivo] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [guardado, setGuardado] = useState(false);
  const [deshacer, setDeshacer] = useState(false);
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

    const faltanUrlsBotones = configLocal.proyectos?.proyectos?.some(p =>
      p.botones?.some(b => !b.url || b.url.trim() === "" || b.url.trim() === "www.")
    );

    const faltanUrlsRedes = configLocal.perfil.redesSociales?.some(r => !r.url || r.url.trim() === "" || r.url.trim() === "www.");

    const resp = await Swal.fire({
      title: "¿Guardar cambios?",
      icon: "question",
      text: (faltanUrlsBotones || faltanUrlsRedes)
      ? "Tienes redes sociales o botones sin URL"
      : "",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar"
    })

    if(resp.isConfirmed){  
      const exito = await empezarGuardarCambios(usuario.uid, config);
      
      if (exito) {
        setGuardado(true);
        setTimeout(() => setGuardado(false), 2000);
      }
    }
  };

  const manejarDeshacerCambios = async () => {
    const resp = await Swal.fire({
      title: "Deshacer cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Deshacer",
      cancelButtonText: "Cancelar"
    })

    if(resp.isConfirmed){  
      const exito = empezarDeshacerCambios();
      
      if (exito) {
        setDeshacer(true);
        setTimeout(() => setDeshacer(false), 2000);
      }
    }
  };

  const manejarDeslogeo = async () => {
    const resp = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: hayCambios ? "Tiene cambios sin guardar" : "",
      icon: hayCambios ? "warning" : "question",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    })

    if(resp.isConfirmed){  
      empezarDeslogeo();
    }   
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
                title="Habilitar/Deshabilitar modo edición"  
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
              title="Guardar cambios"       
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
              onClick={() => hayCambios && manejarDeshacerCambios()} 
              title="Deshacer cambios"      
              className={`flex items-center justify-center
                          rounded-full
                          transition-colors duration-200
                          ${
                            deshacer
                              ? 'bg-green-500'
                              : hayCambios
                              ? 'bg-orange-500 cursor-pointer'
                              : 'bg-gray-400'
                          }
                          w-9 h-9 p-1 `}
            >
                <i 
                className={`${
                            deshacer
                              ? 'fa-solid fa-circle-check'
                              : 'fa-solid fa-arrow-rotate-left'
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
            value={config.urlUsuario}
            spellCheck={false}
            readOnly={!editar}
            pattern="[a-zA-Z0-9_\-]+"
            title="Solo letras, números, guiones y guiones bajos. Sin espacios."
            onChange={(e) => {
              actualizarUrl(e.currentTarget.value);
            }}
            onBlur={(e) => {
              const texto = e.currentTarget.value.trim();

              if (texto.length === 0 && editar) {
                e.currentTarget.value = config.urlUsuario;
                Swal.fire({
                  icon: "warning",
                  title: "El url no puede quedar vacío",
                  showConfirmButton: true,
                  confirmButtonText: "Aceptar"
                });
              } 
              else {
                e.currentTarget.scrollTo({ left: 0 })
              }
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
            title="Cerrar sesión"         
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
