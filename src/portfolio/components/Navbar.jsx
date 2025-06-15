
import {useState, useRef, useEffect} from "react";
import { SelectorColor } from "./SelectorColor";

export const Navbar = ({config, modulosConfig, editar}) => {

  const [mostrarSelectorColor, setMostrarSelectorColor] = useState(false);
  const [posicionSelectorColor, setPosicionSelectorColor] = useState({ top: 0, left: 0 });
  const [colorPaleta, setColorPaleta] = useState(config.colorFondo);
  const [configLocal, setConfigLocal] = useState(config);

  const ultimaActualizacionRef = useRef(0);
  const cambiarColorRef = useRef(() => {});
  const selectorColorRef = useRef(null);
  const botonActivoRef = useRef(null);

  useEffect(() => {
    setConfigLocal(config);
  }, [config]);

  const modulos = Object.entries(modulosConfig)
  .filter(([key]) => key !== "perfil") // Ignorar el modulo perfil
  .map(([_, value]) => ({
    id: value.id,
    titulo: value.titulo,
  }))
  .filter(modulo => modulo.titulo); // Para evitar objetos con título undefined

  const abrirSelectorColor = (e, colorInicial, cambiarColor, opciones = {  vertical: "abajo", // "arriba" | "abajo"
                                                                          horizontal: "derecha", // "izquierda" | "derecha"
                                                                          ajusteVertical: 0 // Ajuste adicional en píxeles
                                                                        } 
  ) => {    
    const boton = e.currentTarget;
    if (botonActivoRef.current === boton) {
      setMostrarSelectorColor(false);
      botonActivoRef.current = null;
      return;
    }

    const rect = boton.getBoundingClientRect();
    const margin = 5;
    let top, left;

    // Posición vertical 
    if (opciones.vertical === "abajo") {
      top = rect.top + window.scrollY + rect.height + margin + (opciones.ajusteVertical || 0);
    } else { // "arriba"
      top = rect.top + window.scrollY - 320 - margin + (opciones.ajusteVertical || 0);
    }

    // Posición horizontal 
    if (opciones.horizontal === "derecha") {
      left = rect.left + window.scrollX + rect.width + margin;
    } else { // "izquierda"
      left = rect.left + window.scrollX - 215 - margin;
      // Ajuste adicional para móvil en posición izquierda
    }

    setPosicionSelectorColor({ top, left });
    setColorPaleta(colorInicial);
    cambiarColorRef.current = cambiarColor;
    botonActivoRef.current = boton;
    setMostrarSelectorColor(true);
  };

  useEffect(() => {
    const clickFueraSelectorColor = (e) => {
      if (
        mostrarSelectorColor && //Se muestra el selector
        selectorColorRef.current && //Verificar que selectorRef no es null
        !selectorColorRef.current.contains(e.target) &&  //Si el click fue fuera del selector
        !botonActivoRef.current.contains(e.target) //El click no fue dentro del botón activo
      ) {
        setMostrarSelectorColor(false);
        botonActivoRef.current = null;
      }
    };

    document.addEventListener("mousedown", clickFueraSelectorColor);
      return () => {
        document.removeEventListener("mousedown", clickFueraSelectorColor);
      };     
  }, [mostrarSelectorColor]);

  const manejarCambioColor = (nuevoColor) => {
    const now = Date.now();
    if (now - ultimaActualizacionRef.current > 100) {
      setColorPaleta(nuevoColor);
      if (typeof cambiarColorRef.current === "function") {
        cambiarColorRef.current(nuevoColor);
      }
      ultimaActualizacionRef.current = now;
    }
  };

  return (
    <nav className={`${editar == true ? 'pt-13' : ''} flex justify-center flex-col text-center relative
                    font-semibold uppercase text-lg
                    py-4 gap-2 
                    sm:py-8 bg-[${configLocal.colorFondo}]
                    sm:text-sm sm:flex-row sm:text-left sm:text-lg sm:gap-5
                    md:gap-10 
                    lg:gap-20`}>    

      {modulos.map((m, indice, list) => (
        <div key={indice} className="sm:inline-flex flex items-center justify-center gap-2">
          <a className={`text-sm text-[${configLocal.colorTexto}]
                        hover:underline hover:underline-offset-8 hover:decoration-4
                        lg:text-md`}                        
              href={`#${m.id}`}>
            {m.titulo}
          </a>
          {editar && indice === list.length - 1 &&(
            <button 
              onClick={(e) =>
                abrirSelectorColor(e, configLocal.colorTexto, (nuevoColor) => {
                  setConfigLocal({ ...configLocal, colorTexto: nuevoColor });
                }, {
                  vertical: "abajo",
                  horizontal: "izquierda",
                  ajusteVertical: -70
                })
              }
              className="flex items-center justify-center cursor-pointer
                        bg-white p-1 rounded-full
                        hover:bg-pink-400">
              <i className="fa-solid fa-palette text-sm"/>
            </button>
          )}
        </div>    
      ))}
      
      {editar === true && (
        <button 
          onClick={(e) =>
                      abrirSelectorColor(e, configLocal.colorFondo, (nuevoColor) => {
                        setConfigLocal({ ...configLocal, colorFondo: nuevoColor });
                      }, {
                        vertical: "abajo",
                        horizontal: "izquierda",
                        ajusteVertical: -95
                      })
                    }
          className={`absolute right-2 top-3 cursor-pointer flex items-center
                              bg-white rounded-full p-2 
                              hover:bg-pink-400
                              xl:right-10`}>
              <i className="fa-solid fa-paint-roller text-sm
                            xl:text-xl"/>
        </button>
      )}

      {mostrarSelectorColor && editar == true && (
        <div
          ref={selectorColorRef}
          className="absolute z-40"
          style={{ top: posicionSelectorColor.top, left: posicionSelectorColor.left }}
        >
          <SelectorColor
            colorInicial={colorPaleta}
            onChange={manejarCambioColor}
          />
        </div>
      )}
            
    </nav>
  )
}
