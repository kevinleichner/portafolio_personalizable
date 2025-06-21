import {useState, useRef, useEffect} from "react";
import { SelectorColor } from "./SelectorColor";
import { useSelectorColor } from '../../hooks';

export const Conocimientos = ({config, editar}) => { 
  const {
      mostrarSelectorColor,
      posicionSelectorColor,
      colorInicial,
      botonColorRef,
      abrirSelectorColor,
      cerrarSelectorColor,
      manejarCambioColor,
    } = useSelectorColor();

  const [titulo, setTitulo] = useState(config.titulo);
  const [conocimientos, setConocimientos] = useState(config.conocimientos);

  const [configLocal, setConfigLocal] = useState(config);

  useEffect(() => {
    setTitulo(config.titulo);
    setConocimientos(config.conocimientos);
    setConfigLocal(config);
  }, [config]);

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
                      horizontal: window.innerWidth < 768 ? 'izquierda' : 'derecha'
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
                              ? { vertical: "arriba", horizontal: "derecha" } 
                              : { vertical: "arriba", horizontal: "izquierda" } )
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
                                  horizontal: window.innerWidth < 768 ? 'izquierda' : 'derecha'
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
            manejarCambioColor={manejarCambioColor}
            top={posicionSelectorColor.top}
            left={posicionSelectorColor.left}
            manejarClickAfuera={cerrarSelectorColor}
            botonColorRef={botonColorRef.current}
          />
        )}

    </div>
  )
}
