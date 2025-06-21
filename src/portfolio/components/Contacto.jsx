import { useState, useEffect } from "react";
import { SelectorColor } from "./SelectorColor";
import { useSelectorColor } from '../../hooks';

export const Contacto = ({config, editar}) => {
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

  const [configLocal, setConfigLocal] = useState(config);

  useEffect(() => {
    setTitulo(config.titulo);
    setConfigLocal(config);
  }, [config]);

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
                <div className={`relative w-full flex justify-center ${editar && 'mt-7'}`}>
                  <input
                    className={`outline rounded-sm bg-[${configLocal.colorBoton}]
                                font-semibold text-[${configLocal.colorTextoBoton}]
                                py-[2%] w-[30%]
                                sm:py-[1%] 
                                sm:w-[15%] 
                                lg:w-[10%] 
                                hover:cursor-pointer hover:brightness-80`} 
                    type="submit" 
                    value="Enviar" 
                  />

                  {editar && (
                    <>
                      <button
                        onClick={(e) =>
                          abrirSelectorColor(e, configLocal.colorTextoBoton, (nuevoColor) => {
                            setConfigLocal({ ...configLocal, colorTextoBoton: nuevoColor });
                          }, {
                            vertical: "arriba",
                            horizontal: "izquierda"
                          })
                        }
                        className="flex items-center justify-center absolute -top-7 right-1/2 cursor-pointer
                                  bg-white p-1  rounded-full hover:bg-pink-400"
                      >
                        <i className="fa-solid fa-palette text-sm" />
                      </button>

                      <button
                        onClick={(e) =>
                          abrirSelectorColor(e, configLocal.colorBoton, (nuevoColor) => {
                            setConfigLocal({ ...configLocal, colorBoton: nuevoColor });
                          }, {
                            vertical: "arriba",
                            horizontal: "derecha"
                          })
                        }
                        className="flex items-center justify-center absolute -top-7 left-1/2 cursor-pointer
                                  bg-white p-1 rounded-full hover:bg-pink-400"
                      >
                        <i className="fa-solid fa-paint-roller text-sm" />
                      </button>
                    </>
                  )}
                </div>          
            </form>

            {editar && (
              <button
              onClick={(e) =>
                abrirSelectorColor(e, configLocal.colorBordes, (nuevoColor) => {
                  setConfigLocal({ ...configLocal, colorBordes: nuevoColor });
                  }, {
                  vertical: "abajo",
                  horizontal: "derecha"
                })
              }


                className="flex items-center justify-center absolute left-1 -top-7 cursor-pointer
                          bg-white p-1 rounded-full hover:bg-pink-400"
              >
                <i className="fa-solid fa-palette text-sm" />
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

    </div>
  )
}
