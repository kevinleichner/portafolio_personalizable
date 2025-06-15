import { useState, useEffect, useRef } from "react";
import { SelectorColor } from "./SelectorColor";

export const Contacto = ({config, editar}) => {
  const [titulo, setTitulo] = useState(config.titulo);

  const [mostrarSelectorColor, setMostrarSelectorColor] = useState(false);
  const [posicionSelectorColor, setPosicionSelectorColor] = useState({ top: 0, left: 0 });

  const [colorPaleta, setColorPaleta] = useState(config.colorFondo);
  const [configLocal, setConfigLocal] = useState(config);

  const ultimaActualizacionRef = useRef(0);
  const cambiarColorRef = useRef(() => {});
  const selectorColorRef = useRef(null);
  const botonActivoRef = useRef(null);

  useEffect(() => {
    setTitulo(config.titulo);
    setConfigLocal(config);
  }, [config]);

  useEffect(() => {
    const clickFueraSelectorColor = (e) => {
      if (
        mostrarSelectorColor && //Se muestra el selector
        selectorColorRef.current && //Verificar que selectorColorRef no es null
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
    }

    setPosicionSelectorColor({ top, left });
    setColorPaleta(colorInicial);
    cambiarColorRef.current = cambiarColor;
    botonActivoRef.current = boton;
    setMostrarSelectorColor(true);
  };

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

   const manejarCambioOrientacionTitulo = () => {
    configLocal.orientacionTitulo === 'center' 
    ? setConfigLocal({ ...configLocal, orientacionTitulo: 'start' }) 
    : setConfigLocal({ ...configLocal, orientacionTitulo: 'center' });
  };

  return (
    <div className={`relative
                      text-center font-sans
                      bg-[${configLocal.colorFondo}]
                      py-10 
                      sm:py-20`} 
          id={config.id}>       
        <div className="w-[85%] mx-auto">
          <div className={`flex items-start gap-2 justify-${configLocal.orientacionTitulo} relative`}>
            <h2 className={`select-none text-[${configLocal.colorTitulo}] outline-none
                            text-4xl font-semibold
                            mb-10    
                            sm:text-5xl`}
                contentEditable={editar}
                suppressContentEditableWarning={true}
                onBlur={(e) => setTitulo(e.currentTarget.textContent)}>
                {titulo}
            </h2>

            {editar && (
              <div className="flex gap-1">
                <button
                  onClick={(e) =>
                    abrirSelectorColor(e, configLocal.colorTitulo, (nuevoColor) => {
                      setConfigLocal({ ...configLocal, colorTitulo: nuevoColor });
                    }, {
                      vertical: "abajo",
                      horizontal: window.innerWidth < 768 ? 'izquierda' : 'derecha',     
                      ajusteVertical: -1900,
                    })
                  }
                  className="flex items-center justify-center cursor-pointer
                            bg-white p-1 rounded-full hover:bg-pink-400"
                >
                  <i className="fa-solid fa-palette text-sm" />
                </button>

                <button
                  onClick={manejarCambioOrientacionTitulo}
                  className="flex items-center justify-center cursor-pointer
                            bg-white p-1 rounded-full hover:bg-pink-400"
                >
                  <i className={`fa-solid ${configLocal.orientacionTitulo == 'center' ? 'fa-align-left' : 'fa-align-center'} text-sm`} />
                </button>
              </div>
              )}
          </div>
          <div className="relative">
            <form className="flex flex-wrap justify-between flex-col
                              sm:flex-row gap-2">
                <input className={`border rounded-sm outline-none border-[${configLocal.colorBordes}]
                                  p-4 
                                  sm:w-[calc(50%-0.25rem)]`} 
                        type="text" 
                        placeholder="Nombre" 
                        name="nombre" 
                        spellCheck="false" 
                        required />
                <input className={`border rounded-sm outline-none border-[${configLocal.colorBordes}]
                                  p-4
                                  sm:w-[calc(50%-0.25rem)]`}
                        type="email" 
                        placeholder="Correo" 
                        name="correo" 
                        spellCheck="false" 
                        required />             
                <textarea className={`border rounded-sm resize-none outline-none border-[${configLocal.colorBordes}]
                                      p-4 w-[100%] h-30`} 
                          name="mensaje" 
                          placeholder="Mensaje" 
                          spellCheck="false"/>
                <input className={`outline rounded-sm bg-[${configLocal.colorBoton}]
                                  font-semibold text-[${configLocal.colorTextoBoton}]
                                  py-[2%] mx-auto w-[30%]
                                  sm:py-[1%] 
                                  sm:w-[15%] 
                                  lg:w-[10%] 
                                  hover:cursor-pointer hover:brightness-80`} 
                        type="submit" 
                        value="Enviar" />          
            </form>

            {editar && (
              <button
              onClick={(e) =>
                abrirSelectorColor(e, configLocal.colorBordes, (nuevoColor) => {
                  setConfigLocal({ ...configLocal, colorBordes: nuevoColor });
                  }, {
                  vertical: "abajo",
                  horizontal: "derecha",
                  ajusteVertical: -1900
                })
              }


                className="flex items-center justify-center absolute left-1 -top-7 cursor-pointer
                          bg-white p-1 rounded-full hover:bg-pink-400"
              >
                <i className="fa-solid fa-palette text-sm" />
              </button>
            )}

            {editar && (
              <button
              onClick={(e) =>
                abrirSelectorColor(e, configLocal.colorTextoBoton, (nuevoColor) => {
                  setConfigLocal({ ...configLocal, colorTextoBoton: nuevoColor });
                  }, {
                  vertical: "abajo",
                  horizontal: "derecha",
                  ajusteVertical: -1900
                })
              }


                className="flex items-center justify-center absolute right-1/2 -bottom-7 cursor-pointer
                          bg-white p-1  rounded-full hover:bg-pink-400"
              >
                <i className="fa-solid fa-palette text-sm" />
              </button>
            )}

            {editar && (
              <button
              onClick={(e) =>
                abrirSelectorColor(e, configLocal.colorBoton, (nuevoColor) => {
                  setConfigLocal({ ...configLocal, colorBoton: nuevoColor });
                  }, {
                  vertical: "abajo",
                  horizontal: "derecha",
                  ajusteVertical: -1900
                })
              }


                className="flex items-center justify-center absolute left-1/2 -bottom-7 cursor-pointer
                          bg-white p-1 rounded-full hover:bg-pink-400"
              >
                <i className="fa-solid fa-paint-roller text-sm" />
              </button>
            )}
          </div>
        </div>

        {editar === true && (
        <button onClick={(e) =>
                      abrirSelectorColor(e, configLocal.colorFondo, (nuevoColor) => {
                        setConfigLocal({ ...configLocal, colorFondo: nuevoColor });
                      }, {
                        vertical: "abajo",
                        horizontal: "izquierda",
                        ajusteVertical: -1900,
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

    </div>
  )
}
