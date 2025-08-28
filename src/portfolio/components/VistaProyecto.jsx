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
                        rounded-sm w-[50%] max-h-[95%]
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
          <p className={`w-[90%] outline-none text-[${contenido.colorTexto}]`}
              contentEditable={editar}
              suppressContentEditableWarning={true}
              onBlur={(e) => actualizarDescripcion(e.currentTarget.textContent)}>
            {contenido.descripcion}
          </p>
          <div className="flex justify-center gap-6 
                          w-full p-1">
            {contenido.botones.map((b, indice) => (
                <a key={indice} 
                   target="_blank"
                   rel="noopener noreferrer"
                   href={editar === false ? (b.url.startsWith('http') ? b.url : `https://${b.url}`) : undefined}
                   className={`flex justify-center gap-1 items-center relative
                                bg-[${b.color}]
                                p-2 rounded-sm min-w-20
                                ${editar == false ? 'hover:brightness-80' : 'cursor-default'} `}>
                  <img className="w-[40px]" src={b.imagen} />
                  {editar && (
                    <button
                      onClick={() => document.getElementById('imgBoton-' + indice).click()}
                      className="flex items-center justify-center absolute -top-3 right-7 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
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
                                  }, {
                                    vertical: "abajo",
                                    horizontal: "izquierda"
                                  })
                                }
                            className={`absolute -top-3 right-1 cursor-pointer flex items-center
                                          bg-white rounded-full p-1 
                                          hover:bg-pink-400`}>
                          <i className="fa-solid fa-paint-roller text-sm"/>
                    </button>
                  )}
                </a>                                         
            ))}
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
