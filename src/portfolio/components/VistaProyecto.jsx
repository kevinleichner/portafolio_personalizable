import {useState, useEffect} from "react";
import { SelectorColor } from "./SelectorColor";
import { useSelectorColor } from '../../hooks';
import { Carrusel } from "./Carrusel";

export const VistaProyecto = ({ cerrar, contenido, editar }) => {
  const {
      mostrarSelectorColor,
      posicionSelectorColor,
      colorInicial,
      botonRef,
      abrirSelectorColor,
      cerrarSelectorColor,
      manejarCambioColor,
    } = useSelectorColor();

  const [descripcion, setDescripcion] = useState(contenido.descripcion);
  const [etiquetas, setEtiquetas] = useState(contenido.etiquetas);
  const [botones, setBotones] = useState(contenido.botones);

  const [contenidoLocal, setContenidoLocal] = useState(contenido);

  useEffect(() => {
    setDescripcion(contenido.descripcion);
    setEtiquetas(contenido.etiquetas);
    setBotones(contenido.botones);
    setContenidoLocal(contenido);
  }, [contenido]);

  const cambiarValorEtiquetas = (indice, campo, valor) => {
    const nuevasEtiquetas = etiquetas.map((t, i) =>
      i === indice ? { ...t, [campo]: valor } : t
    );
    setEtiquetas(nuevasEtiquetas);
  };

  const manejarCambioImagen = (e, indice) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBotones((prev) => {
          const nuevos = [...prev];
          nuevos[indice] = { ...nuevos[indice], imagen: reader.result };
          return nuevos;
        });

        setContenidoLocal((prev) => {
          const nuevos = [...prev.botones];
          nuevos[indice] = { ...nuevos[indice], imagen: reader.result };
          return { ...prev, botones: nuevos };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const cambiarValorBotones = (indice, campo, valor) => {
    const nuevosBotones = botones.map((t, i) =>
      i === indice ? { ...t, [campo]: valor } : t
    );
    setEtiquetas(nuevosBotones);
  };

    const actualizarColorBoton = (indice, nuevoColor) => {
    setContenidoLocal(prevConfig => {
      const nuevosBotones = [...prevConfig.botones];
      nuevosBotones[indice] = {
        ...nuevosBotones[indice],
        color: nuevoColor,
      };
      return { ...prevConfig, botones: nuevosBotones };
    });
  };

  const cambiarImagenCarrusel = (e, indice) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setContenidoLocal((prev) => {
        const nuevasImagenes = [...prev.imagenes];
        nuevasImagenes[indice] = { ...nuevasImagenes[indice], url: reader.result };
        return { ...prev, imagenes: nuevasImagenes };
      });
    };
    reader.readAsDataURL(file);
  }
};

const eliminarImagenCarrusel = (indice) => {
  setContenidoLocal((prev) => {
    const nuevasImagenes = prev.imagenes.filter((_, i) => i !== indice);
    return { ...prev, imagenes: nuevasImagenes };
  });
};

const agregarImagenCarrusel = () => {
    setContenidoLocal(prev => {
      const nuevaImagen = { 
        url: "../img-proyectos/banco.jpg"
      };
      return {
        ...prev,
        imagenes: [...prev.imagenes, nuevaImagen]
      };
    });
  };

    return (
      <div className="fixed inset-0 flex text-center justify-center items-center z-50
                      bg-black/70">      

        <div className={`relative gap-3 flex justify-center flex-col items-center bg-[${contenidoLocal.colorFondoTexto}]
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

          {contenidoLocal?.imagenes?.length > 0 && (
            <Carrusel 
              imagenes={contenidoLocal.imagenes}
              colorFondo={contenidoLocal.colorFondoImagenes}
              editar={editar}
              cambiarImagenCarrusel={cambiarImagenCarrusel}
              eliminarImagenCarrusel={eliminarImagenCarrusel}
              agregarImagenCarrusel={agregarImagenCarrusel}
            />

          )}

          <div className="flex gap-1 flex-wrap
                        text-sm 
                        p-1">
            {contenidoLocal.etiquetas.map((e, indice) => (
                <h6 key={indice} className={`p-1 outline-none bg-[${contenidoLocal.colorFondoEtiqueta}] text-[${contenidoLocal.colorTexto}]
                                rounded-sm 
                                2xl:p-2`}
                    contentEditable={editar}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => cambiarValorEtiquetas(indice, "texto", e.currentTarget.textContent)}>
                    {e.texto}
                </h6>
            ))}    
          </div>
          <p className={`w-[90%] outline-none text-[${contenidoLocal.colorTexto}]`}
              contentEditable={editar}
              suppressContentEditableWarning={true}
              onBlur={(e) => setDescripcion(e.currentTarget.textContent)}>
            {descripcion}
          </p>
          <div className="flex justify-center gap-6 
                          w-full p-1">
            {contenidoLocal.botones.map((b, indice) => (
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
                  <p className={`${editar == true ? 'cursor-text' : ''} outline-none text-[${contenidoLocal.colorTexto}]`}
                    contentEditable={editar}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => cambiarValorBotones(indice, "texto", e.currentTarget.textContent)}>
                    {b.texto}
                  </p>

                  {editar === true && (
                    <button onClick={(e) =>
                                  abrirSelectorColor(e, contenidoLocal.botones[indice].color, (nuevoColor) => {
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
                          abrirSelectorColor(e, contenidoLocal.colorFondoImagenes, (nuevoColor) => {
                            setContenidoLocal({ ...contenidoLocal, colorFondoImagenes: nuevoColor });
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
                          abrirSelectorColor(e, contenidoLocal.colorFondoTexto, (nuevoColor) => {
                            setContenidoLocal({ ...contenidoLocal, colorFondoTexto: nuevoColor });
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
            onChange={manejarCambioColor}
            top={posicionSelectorColor.top}
            left={posicionSelectorColor.left}
            onClickFuera={cerrarSelectorColor}
            botonRef={botonRef.current}
          />
        )}
      </div>
    );
}
