import {useState, useRef, useEffect} from "react";
import { SelectorColor } from "./SelectorColor";

export const Experiencia = ({config, editar}) => {
    const [titulo, setTitulo] = useState(config.titulo);
    const [tarjetas, setTarjetas] = useState(config.tarjetas);

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
    setTarjetas(config.tarjetas);
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

  const actualizarColorTarjeta = (indice, nuevoColor, propiedad = 'colorFondo') => {
    setConfigLocal(prevConfig => {
      const nuevasTarjetas = [...prevConfig.tarjetas];
      nuevasTarjetas[indice] = {
        ...nuevasTarjetas[indice],
        [propiedad]: nuevoColor,
      };
      return { ...prevConfig, tarjetas: nuevasTarjetas };
    });
  };

  const cambiarValorTarjetas = (indice, campo, valor) => {
    const nuevasTarjetas = tarjetas.map((t, i) =>
      i === indice ? { ...t, [campo]: valor } : t
    );
    setTarjetas(nuevasTarjetas);
  };

  const eliminarTarjeta = (indice) => {
  setConfigLocal((prev) => {
    const nuevasTarjetas = prev.tarjetas.filter((_, i) => i !== indice);
    return { ...prev, tarjetas: nuevasTarjetas };
  });
};

const agregarTarjeta = () => {
    setConfigLocal(prev => {
      const nuevaTarjeta = { 
        puesto: "Rol o puesto",
        empresa: "Nombre de empresa",
        tiempo: "Enero 2020 - Febrero 2021",
        descripcion: "Descripcion experiencia",
        colorTexto: "#000",
        colorFondo: "#ffff"
      };
      return {
        ...prev,
        tarjetas: [...prev.tarjetas, nuevaTarjeta]
      };
    });
  };

  return (
    <div className={`text-center relative
                    bg-[${configLocal.colorFondo}]
                    py-10 
                    sm:py-20 ]`} 
        id={config.id}>

        <div className="w-[85%] mx-auto">

          <div className={`flex items-start gap-2 justify-${configLocal.orientacionTitulo} relative`}>

            <h2 className={`select-none outline-none text-[${configLocal.colorTitulo}]
                            mb-10 
                            text-4xl font-semibold
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

            {configLocal.tarjetas.map((t, indice) => (
                <div key={indice} className={`flex justify-between relative
                                shadow-md bg-[${t.colorFondo}]
                                border-t-2
                                mx-auto mt-2 p-2 
                                sm:border-0 sm:p-10`}>
                    <div className={`flex flex-col text-start gap-2 text-[${t.colorTexto}]
                                    p-2
                                    sm:border-l-2`}>
                        <h3 className="text-2xl outline-none font-semibold
                                        sm:text-3xl"
                            contentEditable={editar}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => cambiarValorTarjetas(indice, "puesto", e.currentTarget.textContent)}>
                            {t.puesto}
                        </h3>
                     
                        <h5 className="text-lg outline-none
                                        sm:text-xl"
                             contentEditable={editar}
                             suppressContentEditableWarning={true}
                             onBlur={(e) => cambiarValorTarjetas(indice, "empresa", e.currentTarget.textContent)}>
                            {t.empresa}
                        </h5>
                        <p className="text-sm outline-none
                                        sm:text-md"
                            contentEditable={editar}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => cambiarValorTarjetas(indice, "tiempo", e.currentTarget.textContent)}>
                            {t.tiempo}
                        </p>
                        <p className="lg:text-lg outline-none"
                            contentEditable={editar}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => cambiarValorTarjetas(indice, "descripcion", e.currentTarget.textContent)}>
                            {t.descripcion}
                        </p>
                    </div>

                    {editar && (
                        <button
                        onClick={() => eliminarTarjeta(indice)}
                        className="flex items-center justify-center absolute top-1 right-1 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                        >
                        <i className="fa-solid fa-trash text-sm" />
                        </button>
                    )}

                    {editar && (
                        <button
                        onClick={(e) =>
                          abrirSelectorColor(e, configLocal.tarjetas[indice].colorFondo, (nuevoColor) => {
                            actualizarColorTarjeta(indice, nuevoColor, "colorFondo");
                            }, {
                            vertical: "abajo",
                            horizontal: "izquierda",
                            ajusteVertical: -875 
                          })
                        }


                          className="flex items-center justify-center absolute right-7 top-1 cursor-pointer
                                    bg-white p-1 rounded-full hover:bg-pink-400"
                        >
                          <i className="fa-solid fa-paint-roller text-sm" />
                        </button>
                      )}


                    {editar && (
                        <button
                        onClick={(e) =>
                          abrirSelectorColor(e, configLocal.tarjetas[indice].colorTexto, (nuevoColor) => {
                            actualizarColorTarjeta(indice, nuevoColor, "colorTexto");
                            }, {
                            vertical: "abajo",
                            horizontal: "izquierda",
                            ajusteVertical: -875 
                          })
                        }


                          className="flex items-center justify-center absolute right-13 top-1 cursor-pointer
                                    bg-white p-1 rounded-full hover:bg-pink-400"
                        >
                          <i className="fa-solid fa-palette text-sm" />
                        </button>
                      )}                     
                </div>
              ))}
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

      {editar && (
        <div className={`w-[100%] 
                        sm:w-[85%] 
                        mx-auto mt-2
                        h-[calc(100%/3)]`}>
          <button
            onClick={agregarTarjeta}
            className="w-full h-full bg-white rounded-sm flex items-center justify-center cursor-pointer hover:bg-gray-200 border-2 border-dashed border-gray-400"
          >
            <i className="fa-solid fa-plus text-3xl text-gray-600" />
          </button>
        </div>
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
