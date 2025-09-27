import { SelectorColor } from "../components/SelectorColor";
import { useSelectorColor, usePortfolioStore } from '../../hooks';

export const Contacto = ({config, editar}) => {
  const componente = 'contacto';
  
  const {
      mostrarSelectorColor,
      posicionSelectorColor,
      colorInicial,
      botonColorRef,
      abrirSelectorColor,
      cerrarSelectorColor,
      manejarCambioColor,
    } = useSelectorColor();

  const {desactivarModuloPorKey, actualizarConfigLocal} = usePortfolioStore();

  const actualizarTitulo = (nuevoTitulo) => {
    actualizarConfigLocal({
      key: componente,
      propiedad: 'titulo',
      valor: nuevoTitulo
    })
  }

  const manejarCambioOrientacionTitulo = () => {
    const orientacion = config.orientacionTitulo === 'center' 
    ? 'start' 
    : 'center';

    actualizarConfigLocal({
      key: componente,
      propiedad: 'orientacionTitulo',
      valor: orientacion
    });
  };

  return (
    <div className={`relative
                      text-center font-sans
                      bg-[${config.colorFondo}]
                      py-10 
                      sm:py-20`} 
          id={config.id}>       
        <div className="w-[85%] mx-auto">
          <div className={`flex items-start gap-2 justify-${config.orientacionTitulo} relative`}>
            <h2 className={`select-none text-[${config.colorTitulo}] outline-none
                            text-4xl font-semibold
                            mb-10    
                            sm:text-5xl`}
                contentEditable={editar}
                suppressContentEditableWarning={true}
                onBlur={(e) => actualizarTitulo(e.currentTarget.textContent)}>
                {config.titulo}
            </h2>

            {editar && (
              <div className="flex gap-1">
                <button
                  onClick={(e) =>
                    abrirSelectorColor(e, config.colorTitulo, (nuevoColor) => {
                      actualizarConfigLocal({ 
                        key: componente,
                        propiedad: 'colorTitulo', 
                        valor: nuevoColor });
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
                  <i className={`fa-solid ${config.orientacionTitulo == 'center' ? 'fa-align-left' : 'fa-align-center'} text-sm`} />
                </button>
              </div>
              )}
          </div>
          <div className="relative">
            <form className="flex flex-wrap justify-between flex-col
                              sm:flex-row gap-2">
                <input className={`border rounded-sm outline-none border-[${config.colorBordes}]
                                  p-4 
                                  sm:w-[calc(50%-0.25rem)]`} 
                        type="text" 
                        placeholder="Nombre" 
                        name="nombre" 
                        spellCheck="false" 
                        required />
                <input className={`border rounded-sm outline-none border-[${config.colorBordes}]
                                  p-4
                                  sm:w-[calc(50%-0.25rem)]`}
                        type="email" 
                        placeholder="Correo" 
                        name="correo" 
                        spellCheck="false" 
                        required />             
                <textarea className={`border rounded-sm resize-none outline-none border-[${config.colorBordes}]
                                      p-4 w-[100%] h-30`} 
                          name="mensaje" 
                          placeholder="Mensaje" 
                          spellCheck="false"/>
                <div className={`relative w-full flex justify-center ${editar && 'mt-7'}`}>
                  <input
                    className={`outline rounded-sm bg-[${config.colorBoton}]
                                font-semibold text-[${config.colorTextoBoton}]
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
                          abrirSelectorColor(e, config.colorTextoBoton, (nuevoColor) => {
                            actualizarConfigLocal({ 
                              key: componente,
                              propiedad: 'colorTextoBoton', 
                              valor: nuevoColor });
                          }, {
                            vertical: "arriba",
                            horizontal: "izquierda"
                          })
                        }
                        className="flex items-center justify-center absolute -top-7 right-[50.5%] cursor-pointer
                                  bg-white p-1  rounded-full hover:bg-pink-400"
                      >
                        <i className="fa-solid fa-palette text-sm" />
                      </button>

                      <button
                        onClick={(e) =>
                          abrirSelectorColor(e, config.colorBoton, (nuevoColor) => {
                            actualizarConfigLocal({ 
                              key: componente,
                              propiedad: 'colorBoton', 
                              valor: nuevoColor });
                          }, {
                            vertical: "arriba",
                            horizontal: "derecha"
                          })
                        }
                        className="flex items-center justify-center absolute -top-7 left-[50.5%] cursor-pointer
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
                abrirSelectorColor(e, config.colorBordes, (nuevoColor) => {
                  actualizarConfigLocal({ 
                        key: componente,
                        propiedad: 'colorBordes', 
                        valor: nuevoColor });
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
                      abrirSelectorColor(e, config.colorFondo, (nuevoColor) => {
                        actualizarConfigLocal({ 
                          key: componente,
                          propiedad: 'colorFondo', 
                          valor: nuevoColor });
                      }, {
                        vertical: "abajo",
                        horizontal: "izquierda"
                      })
                    }
                className={`absolute right-10 top-3 cursor-pointer flex items-center
                              bg-white rounded-full p-2 
                              hover:bg-pink-400
                              xl:right-14`}>
              <i className="fa-solid fa-paint-roller text-sm
                            xl:text-xl"/>
        </button>
      )}

      {editar === true && (
        <button onClick={(e) =>
                      desactivarModuloPorKey('contacto')
                    }
                className={`absolute right-2 top-3 cursor-pointer flex items-center
                              bg-white rounded-full p-2 
                              hover:bg-red-500
                              xl:right-5`}>
              <i className="fa-solid fa-trash text-sm
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
