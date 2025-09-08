import { useState, useRef } from "react";
import { SelectorColor } from "./SelectorColor";
import { useSelectorColor } from '../../hooks';
import { Carrusel } from "./Carrusel";

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
  
  const urlRefs = useRef({});

  const actualizarDescripcion = (nuevaDescripcion) => {
    actualizarProyecto({
      ...contenido,
      descripcion: nuevaDescripcion
    });
  }
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

  const manejarCambioImagen = (e, indice) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return; // validación

    const reader = new FileReader();
    reader.onloadend = () => {
      const nuevosBotones = [...contenido.botones];
      nuevosBotones[indice] = {
        ...nuevosBotones[indice],
        imagen: reader.result,
      };

      actualizarProyecto({
        ...contenido,
        botones: nuevosBotones,
      });
    };
    
    reader.readAsDataURL(file);
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

      const nuevoBoton = { //TODO: hacer que tome el por defecto
          imagen: "../img-botones/descargas.png",
          texto: "Descargar",
          color: "#07e71b",
          url: "facebook.com",
          id: Math.random()
      }
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

  const cambiarImagenCarrusel = (e, indiceImagen) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const nuevasImagenes = [...contenido.imagenes];
      nuevasImagenes[indiceImagen] = { ...nuevasImagenes[indiceImagen], url: reader.result };

      actualizarProyecto({
        ...contenido,
        imagenes: nuevasImagenes
      });
    };
    reader.readAsDataURL(file);
  };

  const eliminarImagenCarrusel = (indiceImagen) => {
    const nuevasImagenes = contenido.imagenes.filter((_, i) => i !== indiceImagen);

    actualizarProyecto({
      ...contenido,
      imagenes: nuevasImagenes
    });
  };

  const agregarImagenCarrusel = () => {
    const nuevasImagenes = [...contenido.imagenes, { url: "../img-proyectos/banco.jpg" }];

    actualizarProyecto({
      ...contenido,
      imagenes: nuevasImagenes
    });
  };


    return (
      <div className="fixed inset-0 flex text-center justify-center items-center z-50
                      bg-black/70">      

        <div className={`relative gap-3 flex justify-center flex-col items-center bg-[${contenido.colorFondoTexto}]
                        rounded-sm w-[80%] lg:w-[60%] max-h-[95%]
                        shadow-xl`}>         
        
          <button
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
            />

          )}

          <div className="flex gap-1 flex-wrap
                        text-sm 
                        p-1">
            {contenido.etiquetas.map((e, indice) => (
                <h6 key={indice} className={`p-1 outline-none bg-[${contenido.colorFondoEtiqueta}] text-[${contenido.colorTexto}] 
                                rounded-sm 
                                2xl:p-2`}
                    contentEditable={editar}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => cambiarValorEtiquetas(indice, "texto", e.currentTarget.textContent)}>
                    {e.texto}
                </h6>
            ))}    
          </div>
          <p className={`w-[90%] outline-none text-[${contenido.colorTexto}] text-sm sm:text-base`}
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
                                p-2 rounded-sm min-w-20 sm:w-[30%] lg:w-auto
                                ${editar == false ? 'hover:brightness-80' : 'cursor-default'} `}>
                  <img className="w-[30px] sm:w-[40px]" src={b.imagen} />
                  {editar && (
                    <button
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
                  <p className={`${editar == true ? 'cursor-text' : ''} outline-none text-[${contenido.colorTexto}]`}
                    contentEditable={editar}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => cambiarValorBotones(indice, "texto", e.currentTarget.textContent)}>
                    {b.texto}
                  </p>

                  {editar === true && (
                    <button onClick={(e) =>
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
                    onClick={(e) =>
                      eliminarBoton(indice)
                    }
                    className="flex items-center absolute -top-3 right-1 cursor-pointer
                              bg-white p-1 rounded-full hover:bg-pink-400
                              z-10"
                  >
                    <i className="fa-solid fa-trash text-sm" />
                  </button>
                  )}

                  
                  {editar === true && (
                  <button
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
                          ref={(el) => (urlRefs.current[indice] = el)}
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
                        >
                          {b.url}
                        </p>
                      )}
                </a>                                         
            ))}
            
            {editar === true && contenido.botones.length < 3 && (
              <button onClick={agregarBoton}>
                <i className="fa-solid fa-plus fa-2x text-gray-500 cursor-pointer
                              rounded-sm border-2
                              p-2 px-10 ml-1
                              hover:text-black" />
              </button>
            )}
          </div> 

          {editar === true && (
            <button onClick={(e) =>
                          abrirSelectorColor(e, contenido.colorFondoImagenes, (nuevoColor) => {
                            actualizarProyecto({
                              ...contenido,
                              colorFondoImagenes: nuevoColor
                            });
                          }, {
                            vertical: "abajo",
                            horizontal: "izquierda"
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
            <button onClick={(e) =>
                          abrirSelectorColor(e, contenido.colorFondoTexto, (nuevoColor) => {
                            actualizarProyecto({ 
                              ...contenido, 
                              colorFondoTexto: nuevoColor 
                            });
                          }, {
                            vertical: "abajo",
                            horizontal: "derecha"
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
