import { useState, useEffect, useRef } from "react";
import { SelectorColor } from "./SelectorColor";
import { SelectorIcono } from "./SelectorIcono";
import { useSelectorColor } from '../../hooks';
import { Icon } from '@iconify/react';

export const Perfil = ({ config, editar }) => {

  const {
      mostrarSelectorColor,
      posicionSelectorColor,
      colorInicial,
      botonRef,
      abrirSelectorColor,
      cerrarSelectorColor,
      manejarCambioColor,
    } = useSelectorColor();

  const [titulo, setTitulo] = useState(config.titulo); 
  const [descripcion, setDescripcion] = useState(config.descripcion); 
  const [imagenPerfil, setImagenPerfil] = useState(config.imagen);


  const [configLocal, setConfigLocal] = useState(config);
  const [mostrarUrls, setMostrarUrls] = useState(config.redesSociales.map(() => false));

  const [mostrarSelectorIcono, setMostrarSelectorIcono] = useState(false);
  const [posicionSelectorIcono, setPosicionSelectorIcono] = useState({ top: 0, left: 0 });
  const [indiceRedSocialSeleccionada, setIndiceRedSocialSeleccionada] = useState(null);

  const selectorIconoRef = useRef(null);
  const botonActivoRef = useRef(null);
  const urlRefs = useRef({});

  //Ver si voy a necesitar esto
  useEffect(() => {
    setConfigLocal(config);
    setTitulo(config.titulo);
    setDescripcion(config.descripcion);
    setImagenPerfil(config.imagen);
  }, [config]);

  useEffect(() => {
    const clickFueraSelectorIcono = (e) => {
      if (
        mostrarSelectorIcono &&
        selectorIconoRef.current &&
        !selectorIconoRef.current.contains(e.target) &&
        !botonActivoRef.current.contains(e.target)
      ) {
        setMostrarSelectorIcono(false);
        setIndiceRedSocialSeleccionada(null);
         botonActivoRef.current = null;
      }
    };

    document.addEventListener("mousedown", clickFueraSelectorIcono);
    return () => {
      document.removeEventListener("mousedown", clickFueraSelectorIcono);
    };
  }, [mostrarSelectorIcono]);

  const abrirSelectorIcono = (e, indice, opciones = { 
    vertical: "abajo", // "arriba" o "abajo"
    horizontal: "derecha", // "izquierda" o "derecha"
    ajusteVertical: 0 // Ajuste adicional
  }) => {
    const boton = e.currentTarget;

    if (botonActivoRef.current === boton) {
      setMostrarSelectorIcono(false);
      setIndiceRedSocialSeleccionada(null);
      botonActivoRef.current = null;
      return;
    }

    const rect = boton.getBoundingClientRect();
    const margin = 3;
    let top, left;

    // Posición vertical
    if (opciones.vertical === "abajo") {
      top = rect.top + window.scrollY + rect.height + margin + (opciones.ajusteVertical || 0);
    } else {
      top = rect.top + window.scrollY - 320 - margin + (opciones.ajusteVertical || 0); // alto aprox del selector
    }

    // Posición horizontal
    if (opciones.horizontal === "derecha") {
      left = rect.left + window.scrollX + rect.width + margin;
    } else {
      left = rect.left + window.scrollX -197 - margin; // ancho aprox del selector
    }

    setPosicionSelectorIcono({ top, left });
    setIndiceRedSocialSeleccionada(indice);
     botonActivoRef.current = boton;
    setMostrarSelectorIcono(true);
  };


  const manejarSeleccionIcono = (icono) => {
    if (indiceRedSocialSeleccionada === null) return;

    setConfigLocal((prevConfig) => {
      const nuevasRedes = [...prevConfig.redesSociales];
      nuevasRedes[indiceRedSocialSeleccionada] = {
        ...nuevasRedes[indiceRedSocialSeleccionada],
        icono: icono,
      };
      return { ...prevConfig, redesSociales: nuevasRedes };
    });
  };

  const manejarCambioAnchoBorde = () => {
    const anchoActual = parseInt(configLocal.anchoBorde, 10);
    const nuevoAncho = anchoActual < 7 ? anchoActual + 1 : 1;
    setConfigLocal({ ...configLocal, anchoBorde: nuevoAncho });
  };

  const manejarCambioImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPerfil(reader.result); // Base64
        setConfigLocal({ ...configLocal, imagen: reader.result }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const agregarRedSocial = () => {
    setConfigLocal(prev => {
      if (prev.redesSociales.length >= 4) return prev;
      const nuevaRed = { //Cambiar para que tome la por defecto
        icono: "fa-instagram",
        url: "https://",
        colorIcono: "#000000",
        colorFondo: "#ffffff",
        id: Math.random()
      };
      return {
        ...prev,
        redesSociales: [...prev.redesSociales, nuevaRed]
      };
    });
  };

  const eliminarRedSocial = (i) => {
    setConfigLocal(prev => {
      if (prev.redesSociales.length <= 0) return prev; // No elimina si no hay ninguna
      return {
        ...prev,
        redesSociales: prev.redesSociales.filter(r => r.id !== i)
      };
    });
  };

  const actualizarColorRedSocial = (indice, nuevoColor, propiedad = "colorIcono") => {
    setConfigLocal(prevConfig => {
      const nuevasRedes = [...prevConfig.redesSociales];
      nuevasRedes[indice] = {
        ...nuevasRedes[indice],
        [propiedad]: nuevoColor,
      };
      return { ...prevConfig, redesSociales: nuevasRedes };
    });
  };

  const actualizarUrlRedSocial = (indice, nuevaUrl) => {
    setConfigLocal(prevConfig => {
      const nuevasRedes = [...prevConfig.redesSociales];
      nuevasRedes[indice] = {
        ...nuevasRedes[indice],
        url: nuevaUrl,
      };
      return { ...prevConfig, redesSociales: nuevasRedes };
    });
  };

  const toggleMostrarUrl = (indice) => {
    setMostrarUrls((prev) => {
      const nueva = prev.map(() => false);
      nueva[indice] = !prev[indice];
      return nueva;
    });
  };

  return (
    <div className={`relative
                    bg-[${configLocal.colorFondo}]
                    py-10 
                    m:py-20`}>                 

      <div className={`flex justify-between relative
                      border-${configLocal.anchoBorde} border-[${configLocal.colorBorde}]
                      mx-auto w-[85%]
                      select-none  
                      lg:w-[70%]`}>     

                      {editar && (
                        <>                       
                          <button
                            onClick={(e) =>
                              abrirSelectorColor(e, configLocal.colorBorde, (nuevoColor) => {
                                setConfigLocal({ ...configLocal, colorBorde: nuevoColor });
                              }, {
                                vertical: "abajo",
                                horizontal: "derecha"
                              })
                            }
                            className="flex items-center absolute -top-8 z-10 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                          >
                            <i className="fa-solid fa-palette text-sm" />
                          </button>

                          <button
                            onClick={manejarCambioAnchoBorde}
                            className="flex items-center absolute -top-8 left-7 z-10 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                          >
                            <i className="fa-solid fa-up-right-and-down-left-from-center text-sm"/>
                          </button>
                        </>
                      )}                     

          <div className="flex flex-col text-center 
                          w-[100%] 
                          md:w-[60%] md:justify-between md:text-start 
                          xl:w-[75%]">

            <div className="p-3">
              
              <div className="flex items-start gap-2 justify-center relative
                              md:justify-start">                
                
                <h1
                  className={`font-semibold tracking-tight outline-none text-4xl text-[${configLocal.colorTitulo}]
                              md:text-5xl 
                              xl:text-6xl`}
                  contentEditable={editar}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setTitulo(e.currentTarget.textContent)}
                >
                  {titulo}
                </h1>

                {editar && (
                  <button
                    onClick={(e) =>
                      abrirSelectorColor(e, configLocal.colorTitulo, (nuevoColor) => {
                        setConfigLocal({ ...configLocal, colorTitulo: nuevoColor });
                      }, {
                        vertical: "abajo",
                        horizontal: window.innerWidth < 768 ? 'izquierda' : 'derecha'     
                      })
                    }
                    className="flex items-center justify-center cursor-pointer
                              bg-white p-1 rounded-full hover:bg-pink-400"
                  >
                    <i className="fa-solid fa-palette text-sm" />
                  </button>
                )}    
              </div>            
              
              <div className="relative visible
                              h-auto mx-auto my-2 w-[60%] 
                              sm:w-[50%] 
                              md:object-cover md:hidden md:w-[35%]  
                              lg:w-[30%]
                              xl:w-[20%] 
                              2xl:object-contain">

              <img  
                src={`${imagenPerfil}`}/>
                {editar && (
                  <button
                    onClick={() => document.getElementById("input-imagen-perfil").click()}
                    className="flex items-center justify-center absolute top-2 right-2 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                  >
                    <i className="fa-solid fa-image text-sm" />
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={manejarCambioImagen}
                  className="hidden"
                  id="input-imagen-perfil"
                />
                </div>

              <div className="flex items-start gap-2 justify-center relative
                              md:justify-start">  
                <p className={`h-auto outline-none text-[${configLocal.colorTexto}]
                              sm:text-lg 
                              xl:text-xl`}
                    contentEditable={editar}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setDescripcion(e.currentTarget.textContent)}>
                    {descripcion}
                </p>

                {editar && (
                    <button
                    onClick={(e) =>
                      abrirSelectorColor(e, configLocal.colorTexto, (nuevoColor) => {
                        setConfigLocal({ ...configLocal, colorTexto: nuevoColor });
                        }, {
                        vertical: "abajo",
                        horizontal: "derecha"
                      })
                    }


                      className="flex items-center justify-center cursor-pointer
                                bg-white p-1 rounded-full hover:bg-pink-400"
                    >
                      <i className="fa-solid fa-palette text-sm" />
                    </button>
                  )}

              </div> 
            </div>   

            <div className="p-2 flex mt-2 justify-center md:justify-start">
              {configLocal.redesSociales.map((r, indice) => (
                <div key={indice} className="relative inline-block mx-1">
                  
                  {editar && (
                    <>
                      <button
                        onClick={(e) =>
                          abrirSelectorColor(e, configLocal.redesSociales[indice].colorIcono, (nuevoColor) => {
                            actualizarColorRedSocial(indice, nuevoColor);
                          }, 
                          indice < 2
                          ? { vertical: "arriba", horizontal: "derecha" } 
                          : { vertical: "arriba", horizontal: "izquierda" } )
                        }
                        className="flex items-center absolute -top-6 left-1/2 -translate-x-[120%] cursor-pointer
                                  bg-white p-1 rounded-full hover:bg-pink-400
                                  z-10"
                      >
                        <i className="fa-solid fa-palette text-sm" />
                      </button>                    

                      <button
                        onClick={(e) =>
                          abrirSelectorColor(e, configLocal.redesSociales[indice].colorFondo, (nuevoColor) => {
                            actualizarColorRedSocial(indice, nuevoColor, "colorFondo");
                          }, 
                          indice < 2 
                          ? { vertical: "arriba", horizontal: "derecha" } 
                          : { vertical: "arriba", horizontal: "izquierda" } )
                        }
                        className="flex items-center absolute -top-6 left-1/2 -translate-x-[-20%] cursor-pointer
                                  bg-white p-1 rounded-full hover:bg-pink-400
                                  z-10"
                      >
                        <i className="fa-solid fa-paint-roller text-sm" />
                      </button>

                      <button
                        onClick={() => toggleMostrarUrl(indice)}
                        className="flex items-center absolute -bottom-6 left-1/2 -translate-x-[120%] cursor-pointer
                                  bg-white p-1 rounded-full hover:bg-pink-400
                                  z-10"
                      >
                        <i className="fa-solid fa-link text-sm" />
                      </button>

                      <button
                        onClick={(e) =>
                          eliminarRedSocial(r.id)
                        }
                        className="flex items-center absolute -bottom-6 left-1/2 -translate-x-[-20%] cursor-pointer
                                  bg-white p-1 rounded-full hover:bg-pink-400
                                  z-10"
                      >
                        <i className="fa-solid fa-trash text-sm" />
                      </button>

                     {mostrarUrls[indice] && (
                        <p
                          ref={(el) => (urlRefs.current[indice] = el)}
                          title={r.url}
                          className="absolute -bottom-15 left-1/2 -translate-x-1/2 z-10 outline-none
                                    bg-white p-1 rounded-sm w-48
                                    text-sm text-center
                                    whitespace-nowrap overflow-x-auto
                                    overflow-y-hidden
                                    border border-gray-300 shadow-sm
                                    hide-scrollbar"
                          contentEditable={editar}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {urlRefs.current[indice]?.scrollTo({ left: 0 });
                                          actualizarUrlRedSocial(indice, e.currentTarget.textContent);}}
                        >
                          {r.url}
                        </p>
                      )}
                    </>
                    
                  )}

                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (editar) {
                        e.preventDefault(); 
                      }
                    }}
                  >
                    {editar && (
                      <button
                        onClick={(e) =>
                          abrirSelectorIcono(
                            e,
                            indice,
                            indice < 2
                              ? { vertical: "arriba", horizontal: "derecha", ajusteVertical: -27 }
                              : { vertical: "arriba", horizontal: "izquierda", ajusteVertical: -27 }
                          )
                        }
                        className="flex items-center justify-center absolute top-0 right-0 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                      >
                        <i className="fa-solid fa-image text-sm" />
                      </button>
                    )}

                    <Icon 
                      icon={r.icono} 
                      className={` text-[${r.colorIcono}]
                        rounded-sm p-2
                        bg-[${r.colorFondo}]
                        ${!editar && 'md:bg-transparent md:hover:bg-[' + r.colorFondo + ']'}
                        ${editar && 'md:bg-[' + r.colorFondo + ']'}
                        md:p-3
                      `}
                      width="52" 
                      height="52"
                    />

                  </a>                 
                </div>
              ))}


              {editar === true && configLocal.redesSociales.length < 4 && (
                <button onClick={agregarRedSocial}>
                  <i className="fa-solid fa-plus fa-2x text-gray-500 cursor-pointer
                                rounded-sm border-2
                                p-2 ml-1
                                hover:text-black" />
                </button>
              )}
            </div>
          </div>

          <div className="relative hidden
                h-auto m-2 w-[50%]
                md:block md:w-[35%] 
                lg:w-[30%] 
                xl:w-[20%] 
                2xl:object-contain">

            <img
              className="object-cover w-full h-full"
              src={`${imagenPerfil}`}
            />

            {editar && (
              <button
                onClick={() => document.getElementById("input-imagen-perfil").click()}
                className="flex items-center justify-center absolute top-2 right-2 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
              >
                <i className="fa-solid fa-image text-sm" />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={manejarCambioImagen}
              className="hidden"
              id="input-imagen-perfil"
            />
          </div>
          
      </div>

      {editar === true && (
        <button onClick={(e) =>
                      abrirSelectorColor(e, configLocal.colorFondo, (nuevoColor) => {
                        setConfigLocal({ ...configLocal, colorFondo: nuevoColor });
                      }, {
                        vertical: "abajo",
                        horizontal: "izquierda"
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

      {mostrarSelectorColor && editar && (
        <SelectorColor
          colorInicial={colorInicial}
          onChange={manejarCambioColor}
          top={posicionSelectorColor.top}
          left={posicionSelectorColor.left}
          onClickFuera={cerrarSelectorColor}
          botonRef={botonRef.current}
        />
      )}

      {mostrarSelectorIcono && editar && (
        <div
          ref={selectorIconoRef}
          className="absolute z-40"
          style={{ top: posicionSelectorIcono.top, left: posicionSelectorIcono.left }}
        >
          <SelectorIcono
            onSeleccionar={manejarSeleccionIcono}
          />
        </div>
      )}

    </div>
  )
}
