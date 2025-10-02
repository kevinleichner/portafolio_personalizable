import { useState } from "react";
import { SelectorColor } from "../components/SelectorColor";
import { useSelectorColor, usePortfolioStore, useImagenes } from '../../hooks';

export const Conocimientos = ({config, editar}) => { 

  const componente = 'conocimientos';

  const {
      mostrarSelectorColor,
      posicionSelectorColor,
      colorInicial,
      botonColorRef,
      abrirSelectorColor,
      cerrarSelectorColor,
      manejarCambioColor,
  } = useSelectorColor();

  const { subirImagen } = useImagenes();
  const [cargandoImgIndice, setCargandoImgIndice] = useState(null);

  const {desactivarModuloPorKey, actualizarConfigLocal} = usePortfolioStore();

  const actualizarTitulo = (nuevoTitulo) => {
    actualizarConfigLocal({
      key: componente,
      propiedad: 'titulo',
      valor: nuevoTitulo
    })
  }

  const actualizarColorConocimiento = (indice, nuevoColor, propiedad = 'colorFondo') => {
      const nuevosConocimientos = [...config.conocimientos];
      nuevosConocimientos[indice] = {
        ...nuevosConocimientos[indice],
        [propiedad]: nuevoColor,
      };

      actualizarConfigLocal({
        key: componente,
        propiedad: 'conocimientos',
        valor: nuevosConocimientos,
      });
  };

  const manejarCambioImagen = async (e, indice) => {
    
    const archivo = e.target.files[0];

    if (!archivo || !archivo.type.startsWith("image/")) return; //Verifico que sea una imagen

    setCargandoImgIndice(indice);
    const url = await subirImagen(archivo, "imagenes_modulos"); 
    
    if (!url) return;

    const nuevosConocimientos = [...config.conocimientos];
    nuevosConocimientos[indice] = { ...nuevosConocimientos[indice], imagen: url };

    actualizarConfigLocal({
      key: "conocimientos",
      propiedad: "conocimientos",
      valor: nuevosConocimientos,
    });

    setCargandoImgIndice(null);
  };

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

  const cambiarValorConocimientos = (indice, campo, valor) => {

    const nuevosConocimientos = [...config.conocimientos];
    nuevosConocimientos[indice] = { ...nuevosConocimientos[indice], [campo]: valor };  
    
    actualizarConfigLocal({
      key: componente,
      propiedad: 'conocimientos',
      valor: nuevosConocimientos,
    });
  };

  const eliminarConocimiento = (indice) => {

    const nuevosConocimientos = config.conocimientos.filter((_, i) => i !== indice);

    actualizarConfigLocal({
      key: componente,
      propiedad: 'conocimientos',
      valor: nuevosConocimientos,
    });

};

const agregarConocimiento = () => {

      const nuevoConocimiento = { 
        imagen: "../img-conocimientos/css.png",
        texto: "HTML",
        colorFondo: "#ccc",
        colorTexto: "#000"
      };

      const nuevosConocimientos = [...config.conocimientos, nuevoConocimiento]

      actualizarConfigLocal({
        key: componente,
        propiedad: 'conocimientos',
        valor: nuevosConocimientos,
      });
  };

  return (
    <div className={`relative
                    bg-[${config.colorFondo}]
                    py-10 
                    sm:py-20`} 
        id={config.id}>
        <div className="w-[85%] mx-auto select-none relative">

          <div className={`flex items-start gap-2 justify-${config.orientacionTitulo} relative`}>

            <h2 className={`text-4xl font-semibold outline-none text-[${config.colorTitulo}]
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

            <div className={`flex flex-wrap justify-center gap-2
                            sm:gap-4`}>
                {config.conocimientos.map((c, indice) => (
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
                              abrirSelectorColor(e, config.conocimientos[indice].colorFondo, (nuevoColor) => {
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

                        {cargandoImgIndice === indice && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-md z-20">
                            <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        {editar && (
                            <button
                              onClick={(e) =>
                                abrirSelectorColor(e, config.colorTexto, (nuevoColor) => {
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

                        <div className="flex items-center justify-center h-[70%]">
                          <img className="max-h-full w-[70%] mx-auto 
                                        sm:w-[100px] object-contain" 
                            src={c.imagen}/>
                        </div>

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
                      desactivarModuloPorKey('conocimientos')
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
