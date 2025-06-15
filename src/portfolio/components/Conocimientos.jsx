import {useState, useRef, useEffect} from "react";
import { SelectorColor } from "./SelectorColor";

export const Conocimientos = ({config, editar}) => { 
  const [titulo, setTitulo] = useState(config.titulo);
  const [conocimientos, setConocimientos] = useState(config.conocimientos);

  const [mostrarSelectorColor, setMostrarSelectorColor] = useState(false);
  const [posicionSelectorColor, setPosicionSelectorColor] = useState({ top: 0, left: 0 });
  const [configLocal, setConfigLocal] = useState(config);
  const [colorPaleta, setColorPaleta] = useState(config.colorFondo);

  const ultimaActualizacionRef = useRef(0);
  const cambiarColorRef = useRef(() => {});
  const selectorColorRef = useRef(null);
  const botonActivoRef = useRef(null);

  useEffect(() => {
    setTitulo(config.titulo);
    setConocimientos(config.conocimientos);
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

  const actualizarColorConocimiento = (indice, nuevoColor, propiedad = 'colorFondo') => {
    setConfigLocal(prevConfig => {
      const nuevosConocimientos = [...prevConfig.conocimientos];
      nuevosConocimientos[indice] = {
        ...nuevosConocimientos[indice],
        [propiedad]: nuevoColor,
      };
      return { ...prevConfig, conocimientos: nuevosConocimientos };
    });
  };

  const manejarCambioImagen = (e, indice) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConocimientos((prev) => {
          const nuevos = [...prev];
          nuevos[indice] = { ...nuevos[indice], imagen: reader.result };
          return nuevos;
        });

        setConfigLocal((prev) => {
          const nuevos = [...prev.conocimientos];
          nuevos[indice] = { ...nuevos[indice], imagen: reader.result };
          return { ...prev, conocimientos: nuevos };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const manejarCambioOrientacionTitulo = () => {
    configLocal.orientacionTitulo === 'center' 
    ? setConfigLocal({ ...configLocal, orientacionTitulo: 'start' }) 
    : setConfigLocal({ ...configLocal, orientacionTitulo: 'center' });
  };

  const cambiarValorConocimientos = (indice, campo, valor) => {
    const nuevosConocimientos = conocimientos.map((t, i) =>
      i === indice ? { ...t, [campo]: valor } : t
    );
    setConocimientos(nuevosConocimientos);
  };

  const eliminarConocimiento = (indice) => {
  setConfigLocal((prev) => {
    const nuevosConocimientos = prev.conocimientos.filter((_, i) => i !== indice);
    return { ...prev, conocimientos: nuevosConocimientos };
  });
};

const agregarConocimiento = () => {
    setConfigLocal(prev => {
      const nuevoConocimiento = { 
        imagen: "../img-conocimientos/css.png",
        texto: "HTML",
        colorFondo: "#ccc",
        colorTexto: "#000"
      };
      return {
        ...prev,
        conocimientos: [...prev.conocimientos, nuevoConocimiento]
      };
    });
  };

  return (
    <div className={`relative
                    bg-[${configLocal.colorFondo}]
                    py-10 
                    sm:py-20`} 
        id={config.id}>
        <div className="w-[85%] mx-auto select-none relative">

          <div className={`flex items-start gap-2 justify-${configLocal.orientacionTitulo} relative`}>

            <h2 className={`text-4xl font-semibold outline-none text-[${configLocal.colorTitulo}]
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
                      ajusteVertical: window.innerWidth < 768 ? -745 : -490,
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

            <div className={`flex flex-wrap justify-center gap-2
                            sm:gap-4`}>
                {configLocal.conocimientos.map((c, indice) => (
                    <div key={indice} className={`content-center text-center relative
                                    shadow-md bg-[${c.colorFondo}]
                                    p-5 w-[45%]
                                    sm:p-10 sm:w-[150px]`}>


                        {editar && (
                            <button
                            onClick={() => eliminarConocimiento(indice)}
                            className="flex items-center justify-center absolute top-1 right-1 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                            >
                            <i className="fa-solid fa-trash text-sm" />
                            </button>
                        )}


                        {editar && (
                          <button
                            onClick={(e) =>
                              abrirSelectorColor(e, configLocal.conocimientos[indice].colorFondo, (nuevoColor) => {
                                actualizarColorConocimiento(indice, nuevoColor, "colorFondo");
                              }, 
                              indice < 2 //VER ESTO 
                              ? { vertical: "arriba", horizontal: "derecha", ajusteVertical: -65 } 
                              : { vertical: "arriba", horizontal: "izquierda", ajusteVertical: -65 } )
                            }
                            className="flex items-center absolute top-1 right-7 cursor-pointer
                                      bg-white p-1 rounded-full hover:bg-pink-400
                                      z-10"
                          >
                            <i className="fa-solid fa-paint-roller text-sm" />
                          </button>    
                        )}

                        {editar && (
                            <button
                              onClick={(e) =>
                                abrirSelectorColor(e, configLocal.colorTexto, (nuevoColor) => {
                                  actualizarColorConocimiento(indice, nuevoColor, "colorTexto");
                                }, {
                                  vertical: "abajo",
                                  horizontal: window.innerWidth < 768 ? 'izquierda' : 'derecha',     
                                  ajusteVertical: window.innerWidth < 768 ? -745 : -490,
                                })
                              }
                              className="flex items-center absolute top-1 right-19 cursor-pointer
                                      bg-white p-1 rounded-full hover:bg-pink-400
                                      z-10"
                            >
                              <i className="fa-solid fa-palette text-sm" />
                            </button>  
                        )}   

                        <img className="w-[70%] mx-auto 
                                        sm:w-[100px]" 
                            src={c.imagen}/>
                            {editar && (
                              <button
                                onClick={() => document.getElementById('img-' + indice).click()}
                                className="flex items-center justify-center absolute top-1 right-13 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                              >
                                <i className="fa-solid fa-image text-sm" />
                              </button>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => manejarCambioImagen(e, indice)}
                              className="hidden"
                              id={'img-' + indice}
                            />
                        <p className={`mt-3 outline-none text-[${c.colorTexto}]`}
                            contentEditable={editar}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => cambiarValorConocimientos(indice, "texto", e.currentTarget.textContent)}>
                            {c.texto}
                        </p>
                    </div>
                ))} 

                {editar && (
                  <div className={`content-center text-center relative
                                  p-5 w-[45%]
                                  sm:p-10 sm:w-[150px]`}>
                    <button
                      onClick={agregarConocimiento}
                      className="absolute inset-0 w-full h-full rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 border-2 border-dashed border-gray-400"
                    >
                      <i className="fa-solid fa-plus text-3xl text-gray-600" />
                    </button>
                  </div>
                )}              
            </div>
        </div>

        {editar === true && (
          <button className={`absolute right-2 top-3 cursor-pointer flex items-center
                                bg-white rounded-full p-2 
                                hover:bg-pink-400
                                xl:right-10`}>
                <i className="fa-solid fa-paint-roller text-sm
                              xl:text-xl"/>
          </button>
        )} 

        {editar === true && (
        <button onClick={(e) =>
                      abrirSelectorColor(e, configLocal.colorFondo, (nuevoColor) => {
                        setConfigLocal({ ...configLocal, colorFondo: nuevoColor });
                      }, {
                        vertical: "abajo",
                        horizontal: "izquierda",
                        ajusteVertical: window.innerWidth < 768 ? -730 : window.innerWidth < 1024 ? -560 : -490,
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
