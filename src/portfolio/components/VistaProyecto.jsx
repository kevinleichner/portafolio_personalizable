import { useState, useRef } from "react";
import { SelectorColor } from "./SelectorColor";
import { useSelectorColor, useImagenes } from '../../hooks';
import { botonProyectoDefecto, etiquetaProyectoDefecto, imagenCarruselDefecto } from "../modulosDefecto";
import { Carrusel } from "./Carrusel";
import Swal from "sweetalert2";

export const VistaProyecto = ({ cerrar, contenido, editar, actualizarProyecto }) => {
  const {
      mostrarSelectorColor,
      posicionSelectorColor,
      colorInicial,
      botonColorRef,
      abrirSelectorColor,
      cerrarSelectorColor,
      manejarCambioColor,
    } = useSelectorColor();

  const [mostrarUrls, setMostrarUrls] = useState(contenido.botones.map(() => false));
  const [cargandoImgBotonIndice, setCargandoImgBotonIndice] = useState(null);
  const [cargandoImgIndice, setCargandoImgIndice] = useState(null);

  const {subirImagen} = useImagenes();
  
  const urlRefs = useRef({});

  const actualizarDescripcion = (nuevaDescripcion) => {
    actualizarProyecto({
      ...contenido,
      descripcion: nuevaDescripcion
    });
  }

  const agregarEtiqueta = () => {
      const nuevasEtiqueta = etiquetaProyectoDefecto;

      const nuevasEtiquetas = [...contenido.etiquetas, nuevasEtiqueta]

      actualizarProyecto({
        ...contenido,
        etiquetas: nuevasEtiquetas
      })
  };

  const eliminarEtiqueta = (indice) => {
      if (contenido.etiquetas.length <= 0) return contenido;

      const nuevasEtiquetas = contenido.etiquetas.filter((_, i) => i !== indice);

      actualizarProyecto({
        ...contenido,
        etiquetas: nuevasEtiquetas
      })

  };

  const cambiarValorEtiquetas = (indiceEtiqueta, campo, valor) => {
    const nuevasEtiquetas = [...contenido.etiquetas];
    nuevasEtiquetas[indiceEtiqueta] = {
      ...nuevasEtiquetas[indiceEtiqueta],
      [campo]: valor
    };

    actualizarProyecto({
      ...contenido,
      etiquetas: nuevasEtiquetas
    });
  };

  const manejarCambioImagen = async(e, indice) => {
    const archivo = e.target.files[0];
    if (!archivo || !archivo.type.startsWith("image/")) return; // validación

    setCargandoImgBotonIndice(indice);
    const url = await subirImagen(archivo, "imagenes_modulos"); 
    
    if (!url) return;

    const nuevosBotones = [...contenido.botones];
    nuevosBotones[indice] = {
      ...nuevosBotones[indice],
      imagen: url,
    };

    actualizarProyecto({
      ...contenido,
      botones: nuevosBotones,
    });

    setCargandoImgBotonIndice(null);
  };

  const cambiarValorBotones = (indiceBoton, campo, valor) => {
    const nuevosBotones = [...contenido.botones];
    nuevosBotones[indiceBoton] = {
      ...nuevosBotones[indiceBoton],
      [campo]: valor
    };

    actualizarProyecto({
      ...contenido,
      botones: nuevosBotones
    });
  };

  const actualizarColorBoton = (indiceBoton, nuevoColor) => {
    const nuevosBotones = [...contenido.botones];
    nuevosBotones[indiceBoton] = {
      ...nuevosBotones[indiceBoton],
      color: nuevoColor
    };

    actualizarProyecto({
      ...contenido,
      botones: nuevosBotones
    });
  };

  const agregarBoton = () => {
      if (contenido.botones.length >= 3) return contenido;

      const nuevoBoton = botonProyectoDefecto;
      const nuevosBotones = [...contenido.botones, nuevoBoton]

      actualizarProyecto({
        ...contenido,
        botones: nuevosBotones
      })
  };

  const eliminarBoton = (indice) => {
      if (contenido.botones.length <= 0) return contenido;

      const nuevosBotones = contenido.botones.filter((_, i) => i !== indice);

      actualizarProyecto({
        ...contenido,
        botones: nuevosBotones
      })

  };

  const actualizarUrlBoton = (indice, nuevaUrl) => {
      const nuevosBotones = [...contenido.botones];
      nuevosBotones[indice] = {
        ...nuevosBotones[indice],
        url: nuevaUrl,
      };

      actualizarProyecto({
        ...contenido,
        botones: nuevosBotones
      })
  };

  const toggleMostrarUrl = (indice) => {
    setMostrarUrls((prev) => {
      const nueva = prev.map(() => false);
      nueva[indice] = !prev[indice];
      return nueva;
    });
  };

  const cambiarImagenCarrusel = async(e, indiceImagen) => {
    const archivo = e.target.files[0];
    if (!archivo || !archivo.type.startsWith("image/")) return;

    setCargandoImgIndice(indiceImagen);
    const urlImg = await subirImagen(archivo, "imagenes_modulos"); 
    
    if (!urlImg) return;

    const nuevasImagenes = [...contenido.imagenes];
    nuevasImagenes[indiceImagen] = { ...nuevasImagenes[indiceImagen], url: urlImg };

    actualizarProyecto({
      ...contenido,
      imagenes: nuevasImagenes
    });

    setCargandoImgIndice(null);
  };

  const eliminarImagenCarrusel = (indiceImagen) => {
    const nuevasImagenes = contenido.imagenes.filter((_, i) => i !== indiceImagen);

    actualizarProyecto({
      ...contenido,
      imagenes: nuevasImagenes
    });
  };

  const agregarImagenCarrusel = () => {
    const nuevasImagenes = [...contenido.imagenes, imagenCarruselDefecto];

    actualizarProyecto({
      ...contenido,
      imagenes: nuevasImagenes
    });
  };


    return (
      <div className="fixed inset-0 flex text-center justify-center items-center z-50
                      bg-black/70">      

        <div className={`relative gap-3 flex justify-center flex-col items-center bg-[${contenido.colorFondoTexto}]
                        rounded-sm w-[80%] lg:w-[60%] md:max-h-[95%]
                        shadow-xl`}>         
        
          <button
              title="Cerrar 'ver más'"
              className="absolute z-50 cursor-pointer
                        bg-red-600 
                        text-sm text-white
                        px-2 top-0 right-0 rounded-tr-sm 
                        hover:text-black"
              onClick={cerrar}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

          {contenido?.imagenes?.length > 0 && (
            <Carrusel 
              imagenes={contenido.imagenes}
              colorFondo={contenido.colorFondoImagenes}
              editar={editar}
              cambiarImagenCarrusel={cambiarImagenCarrusel}
              eliminarImagenCarrusel={eliminarImagenCarrusel}
              agregarImagenCarrusel={agregarImagenCarrusel}
              cargandoImgIndice={cargandoImgIndice}
            />

          )}

          <div className="flex gap-1 flex-wrap justify-center
                        text-sm max-w-[95%]
                        p-1">
            {contenido.etiquetas.map((et, indice) => (
              <div key={indice} className="relative">    
                {editar === true && (
                  <button
                    title="Eliminar etiqueta" 
                    onClick={(e) =>
                      eliminarEtiqueta(indice)
                    }
                    className="flex items-center absolute -top-3 right-0 cursor-pointer
                              bg-white p-1 rounded-full hover:bg-red-500
                              z-10"
                  >
                    <i className="fa-solid fa-trash text-xs" />
                  </button>
                )}        
                <h6 className={`p-1 outline-none text-xs md:text-base bg-[${contenido.colorFondoEtiqueta}] text-[${contenido.colorTexto}] 
                                rounded-sm 
                                2xl:p-2`}
                    spellCheck={false}                 
                    contentEditable={editar}
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
                    onBlur={(e) => {
                      const texto = e.currentTarget.textContent.trim();
  
                      if (texto.length === 0) {
                        e.currentTarget.textContent = et.texto;
                        Swal.fire({
                          icon: "warning",
                          title: "La etiqueta no puede quedar vacía",
                          showConfirmButton: true,
                          confirmButtonText: "Aceptar"
                        });
                      } 
                      else {
                        cambiarValorEtiquetas(indice, "texto", e.currentTarget.textContent)
                      }
                    }}
                >
                  {et.texto}
                </h6>
              </div>
            ))}
            {editar === true && contenido.etiquetas.length < 10 && (
              <button title="Agregar etiqueta"  onClick={agregarEtiqueta}>
                <i className="fa-solid fa-plus fa-1x text-gray-500 cursor-pointer
                              rounded-sm border-2
                              px-5 ml-1
                              hover:text-black" />
              </button>
            )}    
          </div>
          <p className={`w-[90%] outline-none 
              text-[${contenido.colorTexto}] text-sm sm:text-xs md:text-base 
              ${contenido.descripcion && contenido.descripcion.length > 300 
                  ? 'overflow-y-auto max-h-15 sm:max-h-10 md:max-h-20'
                  : ''
              }`}
              spellCheck={false}
              contentEditable={editar}
              suppressContentEditableWarning={true}
              onBlur={(e) => actualizarDescripcion(e.currentTarget.textContent)}>
            {contenido.descripcion}
          </p>
          <div className="flex-column sm:flex justify-center gap-2
                          w-[70%] sm:w-full p-1">
            {contenido.botones.map((b, indice) => (
                <a key={indice} 
                   target="_blank"
                   rel="noopener noreferrer"
                   href={editar === false ? (b.url.startsWith('http') ? b.url : `https://${b.url}`) : undefined}
                   className={`flex justify-center my-1 sm:my-0 gap-1 items-center relative 
                                bg-[${b.color}] text-sm md:text-base
                                p-1 rounded-sm min-w-20 sm:w-[30%] md:min-w-25 md:p-2 lg:w-auto
                                ${editar == false ? 'hover:brightness-80' : 'cursor-default'} `}>
                  {cargandoImgBotonIndice === indice && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-md">
                      <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img className="object-cover h-8 w-8 md:h-11 md:w-11" src={b.imagen} />
                  {editar && (
                    <button
                      title="Cambiar ícono" 
                      onClick={() => document.getElementById('imgBoton-' + indice).click()}
                      className="flex items-center justify-center absolute -top-3 right-13 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                    >
                      <i className="fa-solid fa-image text-sm" />
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => manejarCambioImagen(e, indice)}
                    className="hidden"
                    id={'imgBoton-' + indice}
                  />
                  <p className={`${editar == true ? 'cursor-text' : ''} outline-none sm:text-xs md:text-base text-[${contenido.colorTexto}]`}
                    contentEditable={editar}
                    spellCheck={false}
                    onInput={(e) => { //Que no pueda tener más de 15 carácteres
                      const maximoCaracteres = 15;
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
                    onBlur={(e) => cambiarValorBotones(indice, "texto", e.currentTarget.textContent)}>
                    {b.texto}
                  </p>

                  {editar === true && (
                    <button title="Cambiar color del botón" onClick={(e) =>
                                  abrirSelectorColor(e, contenido.botones[indice].color, (nuevoColor) => {
                                    actualizarColorBoton(indice, nuevoColor);
                                  }, indice < 2 
                                     ? { vertical: "arriba", horizontal: "derecha" } 
                                     : { vertical: "arriba", horizontal: "izquierda" } )
                                }
                            className={`absolute -top-3 right-7 cursor-pointer flex items-center
                                          bg-white rounded-full p-1 
                                          hover:bg-pink-400`}>
                          <i className="fa-solid fa-paint-roller text-sm"/>
                    </button>
                  )}

                  {editar === true && (
                    <button
                      title="Eliminar botón" 
                      onClick={(e) =>
                        eliminarBoton(indice)
                      }
                      className="flex items-center absolute -top-3 right-1 cursor-pointer
                                bg-white p-1 rounded-full hover:bg-red-500
                                z-10"
                    >
                      <i className="fa-solid fa-trash text-sm" />
                    </button>
                  )}

                  
                  {editar === true && (
                  <button
                    title="Cambiar url del botón" 
                    onClick={() => toggleMostrarUrl(indice)}
                    className="flex items-center absolute -top-3 right-19 cursor-pointer
                              bg-white p-1 rounded-full hover:bg-pink-400
                              z-10"
                  >
                    <i className="fa-solid fa-link text-sm" />
                  </button>
                  )}

                  {mostrarUrls[indice] && (
                        <p
                          ref={(e) => (urlRefs.current[indice] = e)}
                          title={b.url}
                          className="absolute -top-12 z-10 outline-none
                                    bg-white p-1 rounded-sm w-48
                                    text-sm text-center
                                    whitespace-nowrap overflow-x-auto
                                    overflow-y-hidden
                                    border border-gray-300 shadow-sm
                                    hide-scrollbar cursor-text"
                          contentEditable={editar}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {urlRefs.current[indice]?.scrollTo({ left: 0 });
                                          actualizarUrlBoton(indice, e.currentTarget.textContent);}}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              toggleMostrarUrl(indice); 
                              urlRefs.current[indice]?.blur(); 
                            }
                          }}
                        >
                          {b.url}
                        </p>
                      )}
                </a>                                         
            ))}
            
            {editar === true && contenido.botones.length < 3 && (
              <button title="Agregar botón" onClick={agregarBoton}>
                <i className="fa-solid fa-plus fa-2x text-gray-500 cursor-pointer
                              rounded-sm border-2
                              p-2 sm:p-1 md:p-2 px-10 ml-1
                              hover:text-black" />
              </button>
            )}
          </div> 

          {editar === true && (
            <button title="Cambiar color de fondo del carrusel"  onClick={(e) =>
                          abrirSelectorColor(e, contenido.colorFondoImagenes, (nuevoColor) => {
                            actualizarProyecto({
                              ...contenido,
                              colorFondoImagenes: nuevoColor
                            });
                          }, {
                            vertical: "abajo",
                            horizontal: "derecha"
                          })
                        }
                    className={`absolute -left-10 top-0 cursor-pointer flex items-center
                                  bg-white rounded-full p-2 
                                  hover:bg-pink-400`}>
                  <i className="fa-solid fa-paint-roller text-sm
                                xl:text-xl"/>
            </button>
          )} 

          {editar === true && (
            <button title="Cambiar color de fondo de información" onClick={(e) =>
                          abrirSelectorColor(e, contenido.colorFondoTexto, (nuevoColor) => {
                            actualizarProyecto({ 
                              ...contenido, 
                              colorFondoTexto: nuevoColor 
                            });
                          }, {
                            vertical: "arriba",
                            horizontal: "izquierda"
                          })
                        }
                    className={`absolute -right-10 bottom-30 cursor-pointer flex items-center
                                  bg-white rounded-full p-2 
                                  hover:bg-pink-400`}>
                  <i className="fa-solid fa-paint-roller text-sm
                                xl:text-xl"/>
            </button>
          )}
                   
        </div>        

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
    );
}
