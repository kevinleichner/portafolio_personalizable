import { useState } from "react";
import { SelectorColor } from "../components/SelectorColor";
import { useSelectorColor, usePortfolioStore, useImagenes, usePosiciones } from '../../hooks';
import { conocimientoDefecto } from "../modulosDefecto";
import Swal from "sweetalert2";

export const Conocimientos = ({config, editar}) => { 

  const componente = 'conocimientos';

  const { refs: conocimientoRefs, obtenerPosicionHorizontal } = usePosiciones(
        config.conocimientos.length, 
        editar
    );
    
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

  const manejarCambioAlineacionTitulo = () => {
    const alineacion = config.alineacionTitulo === 'center' 
    ? 'start' 
    : 'center';

    actualizarConfigLocal({
      key: componente,
      propiedad: 'alineacionTitulo',
      valor: alineacion
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

      const nuevoConocimiento = conocimientoDefecto;

      const nuevosConocimientos = [...config.conocimientos, nuevoConocimiento]

      actualizarConfigLocal({
        key: componente,
        propiedad: 'conocimientos',
        valor: nuevosConocimientos,
      });
  };

  const obtenerPosicionamientoHorizontal = (indiceConocimiento) => {
      const posicion = obtenerPosicionHorizontal(indiceConocimiento);
      if (posicion === 'izquierda') {
          return 'derecha';
      } else if (posicion === 'derecha') {
          return 'izquierda';
      } else {
          return 'izquierda'; 
      }
  }

  return (
    <div className={`relative
                    bg-[${config.colorFondo}]
                    py-10 
                    sm:py-20`} 
        id={config.id}>
        <div className="w-[85%] mx-auto select-none relative">

          <div className={`flex items-start gap-2 justify-${config.alineacionTitulo} relative`}>

            <h2 className={`text-4xl font-semibold outline-none text-[${config.colorTitulo}]
                            mb-10 
                            sm:text-5xl`}
                contentEditable={editar}
                spellCheck={false}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const texto = e.currentTarget.textContent.trim();

                  if (texto.length === 0) {
                    e.currentTarget.textContent = config.titulo;
                    Swal.fire({
                      icon: "warning",
                      title: "El Título no puede quedar vacío",
                      showConfirmButton: true,
                      confirmButtonText: "Aceptar"
                    });
                  } 
                  else {
                    actualizarTitulo(e.currentTarget.textContent)
                  }
                }}
            >
                {config.titulo}
            </h2>

            {editar && (
              <div className="flex gap-1">
                <button
                  title="Cambiar color del título"
                  onClick={(e) =>
                    abrirSelectorColor(e, config.colorTitulo, (nuevoColor) => {
                      actualizarConfigLocal({ 
                        key: componente,
                        propiedad: 'colorTitulo', 
                        valor: nuevoColor });
                    }, {
                      vertical: "abajo",
                      horizontal: posicionHorizontal
                    }) 
                  }
                  className="flex items-center justify-center cursor-pointer
                            bg-white p-1 rounded-full hover:bg-pink-400"
                >
                  <i className="fa-solid fa-palette text-sm" />
                </button>

                <button
                  title="Cambiar alineación del título"
                  onClick={manejarCambioAlineacionTitulo}
                  className="flex items-center justify-center cursor-pointer
                            bg-white p-1 rounded-full hover:bg-pink-400"
                >
                  <i className={`fa-solid ${config.alineacionTitulo == 'center' ? 'fa-align-left' : 'fa-align-center'} text-sm`} />
                </button>
              </div>
              )}
          </div>

            <div className={`flex flex-wrap justify-center gap-2
                            sm:gap-4`}>
                {config.conocimientos.map((c, indice) => {
                  const posicionHorizontal = obtenerPosicionamientoHorizontal(indice);
                  return (
                    <div key={indice} ref={conocimientoRefs.current[indice]}  className={`content-center text-center relative
                                    shadow-md bg-[${c.colorFondo}]
                                    text-sm p-4 w-[45%]
                                    sm:text-md sm:w-[150px]`}>


                        {editar && (
                            <button
                            title="Eliminar"
                            onClick={() => eliminarConocimiento(indice)}
                            className="flex items-center justify-center absolute top-1 right-1 bg-white p-1 rounded-full cursor-pointer hover:bg-red-500"
                            >
                            <i className="fa-solid fa-trash text-sm" />
                            </button>
                        )}


                        {editar && (
                          <button
                            title="Cambiar color del fondo"
                            onClick={(e) =>
                              abrirSelectorColor(e, config.conocimientos[indice].colorFondo, (nuevoColor) => {
                                actualizarColorConocimiento(indice, nuevoColor, "colorFondo");
                              }, 
                              {
                                vertical: "arriba",
                                horizontal: posicionHorizontal
                              })                         
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
                              title="Cambiar color del texto"
                              onClick={(e) =>
                                abrirSelectorColor(e, config.colorTexto, (nuevoColor) => {
                                  actualizarColorConocimiento(indice, nuevoColor, "colorTexto");
                                }, {
                                vertical: "abajo",
                                horizontal: posicionHorizontal
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
                                title="Cambiar imagen"
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
                        <p className={`mt-2 sm:mt-3 outline-none text-[${c.colorTexto}]`}
                            contentEditable={editar}
                            spellCheck={false}
                            onInput={(e) => { //Que no pueda tener más de 20 carácteres
                              const maximoCaracteres = 20;
                              const target = e.currentTarget;
                              if (target.innerText.length > maximoCaracteres) {
                                target.innerText = target.innerText.slice(0, maximoCaracteres);
                                const range = document.createRange();
                                const sel = window.getSelection();
                                range.setStart(target.childNodes[0], maximoCaracteres);
                                range.collapse(true);
                                sel.removeAllRanges();
                                sel.addRange(range);
                              }
                            }}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => cambiarValorConocimientos(indice, "texto", e.currentTarget.textContent)}>
                            {c.texto}
                        </p>
                    </div>
                  )
                })} 

                {editar && (
                  <div className={`content-center text-center relative
                                  p-5 w-[45%]
                                  sm:p-10 sm:w-[150px]`}>
                    <button
                      title="Agregar"
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
        <button title="Cambiar color del fondo" onClick={(e) =>
                      abrirSelectorColor(e, config.colorFondo, (nuevoColor) => {
                        actualizarConfigLocal({ 
                          key: componente,
                          propiedad: 'colorFondo', 
                          valor: nuevoColor });
                      }, {
                        vertical: "abajo",
                        horizontal: posicionHorizontal
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
        <button title="Eliminar módulo" onClick={(e) =>
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
