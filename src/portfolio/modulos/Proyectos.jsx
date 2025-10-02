import {useState} from "react";
import { SelectorColor } from "../components/SelectorColor";
import { useSelectorColor, usePortfolioStore, useImagenes } from '../../hooks';
import { VistaProyecto } from "../components/VistaProyecto";

export const Proyectos = ({config, editar}) => {

  const componente = 'proyectos';

  const {
    mostrarSelectorColor,
    posicionSelectorColor,
    colorInicial,
    botonColorRef,
    abrirSelectorColor,
    cerrarSelectorColor,
    manejarCambioColor,
  } = useSelectorColor();

  const {subirImagen} = useImagenes();
  const [cargandoImgIndice, setCargandoImgIndice] = useState(null);

  const {desactivarModuloPorKey, actualizarConfigLocal} = usePortfolioStore();

  const [indiceProyectoActivo, setIndiceProyectoActivo] = useState(null);

  const cerrarVista = () => {
      setIndiceProyectoActivo(null)
  }    

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

  const manejarCambioImagen = async(e, indice) => {
    
    const archivo = e.target.files[0];

    if (!archivo || !archivo.type.startsWith("image/")) return; //Verifico que sea una imagen

    setCargandoImgIndice(indice);
    const url = await subirImagen(archivo, "imagenes_modulos"); 
    
    if (!url) return;

    const nuevosProyectos = [...config.proyectos];
    
    nuevosProyectos[indice] = { 
      ...nuevosProyectos[indice], 
      imagenFondo: url 
    };

    actualizarConfigLocal({
      key: componente,
      propiedad: 'proyectos',
      valor: nuevosProyectos,
    });

    setCargandoImgIndice(null);
  };

  const actualizarColorProyecto = (indice, nuevoColor, propiedad = 'colorFondo') => {
      
      const nuevosProyectos = [...config.proyectos];
      nuevosProyectos[indice] = {
        ...nuevosProyectos[indice],
        [propiedad]: nuevoColor,
      };

      actualizarConfigLocal({
        key: componente,
        propiedad: 'proyectos',
        valor: nuevosProyectos,
      });

  };

    const cambiarValorProyectos = (indice, campo, valor) => {

    const nuevosProyectos = [...config.proyectos];
    nuevosProyectos[indice] = { ...nuevosProyectos[indice], [campo]: valor };  
    
    actualizarConfigLocal({
      key: componente,
      propiedad: 'proyectos',
      valor: nuevosProyectos,
    });
  };

    const cambiarTextoEtiqueta = (indiceProyecto, indiceEtiqueta, nuevoTexto) => {
      const nuevosProyectos = [...config.proyectos];

      const nuevasEtiquetas = [...nuevosProyectos[indiceProyecto].etiquetas];

      nuevasEtiquetas[indiceEtiqueta] = {
        ...nuevasEtiquetas[indiceEtiqueta],
        texto: nuevoTexto,
      };

      nuevosProyectos[indiceProyecto] = {
        ...nuevosProyectos[indiceProyecto],
        etiquetas: nuevasEtiquetas,
      };

      actualizarConfigLocal({
        key: componente,
        propiedad: 'proyectos',
        valor: nuevosProyectos,
      });
    };

    const eliminarProyecto = (indice) => {
        const nuevosProyectos = config.proyectos.filter((_, i) => i !== indice);

        actualizarConfigLocal({
          key: componente,
          propiedad: 'proyectos',
          valor: nuevosProyectos,
        });
    };

    const agregarProyecto = () => {
        const nuevoProyecto = { 
          titulo: "Titulo",
          colorBoton: "#1a5fad",  
          colorTexto: "#000",
          colorFondoEtiqueta: "#1a5fad",           
          imagenFondo: "../img-proyectos/ahorcado.jpg",
          etiquetas: [
              {
                  texto: "Etiqueta",                                           
              },
              {
                  texto: "Etiqueta",                                            
              },
              {
                  texto: "Etiqueta",                                                                 
              }
              
          ],
          //Ventanita que se abre al presionar "Ver más"
          colorFondoImagenes:"#ccc",
          colorFondoTexto:"#ffff",
          imagenes: [
              {
                  url: "../img-vista-proyecto/foto5.jpg"
              },
              {
                  url: "../img-proyectos/banco.jpg"
              },
              {
                  url: "../img-proyectos/banco.jpg"
              },
              {
                  url: "../img-vista-proyecto/foto4.jpg"
              },
              {
                  url: "../img-vista-proyecto/foto6.jpg"
              }
          ],
          descripcion: "Descripcion proyecto",
          botones: [
              {
                  imagen: "../img-botones/descargas.png",
                  texto: "Descargar",
                  color: "#07e71b",
                  url: "facebook.com"
              },
              {
                  imagen: "../img-botones/descargas.png",
                  texto: "Descargar",
                  color: "#07e71b",
                  url: "facebook.com"
              },
              {
                  imagen: "../img-botones/descargas.png",
                  texto: "Descargar",
                  color: "#07e71b",
                  url: "facebook.com"
              }
          ]
        };

        const nuevosProyectos = [...config.proyectos, nuevoProyecto]

        actualizarConfigLocal({
          key: componente,
          propiedad: 'proyectos',
          valor: nuevosProyectos,
        });
    };

    const actualizarProyecto = (nuevoProyecto) => {
    const nuevosProyectos = [...config.proyectos];
    nuevosProyectos[indiceProyectoActivo] = nuevoProyecto;

    actualizarConfigLocal({
      key: componente,
      propiedad: 'proyectos',
      valor: nuevosProyectos,
    });
  }


  return (
    <div className={`relative
                    bg-[${config.colorFondo}]
                    py-10 
                    sm:py-20`} 
        id={config.id}>       

        <div className="select-none
                        w-[85%] mx-auto ">

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

            <div className={`flex flex-wrap justify-center gap-6`}>   
                {config.proyectos.map((p, indice) => (
                    <div key={indice} className={`relative
                                    shadow-md 
                                    mt-3
                                    w-[100%]
                                    transition duration-300 
                                    ${editar == false && 'hover:scale-105'} 
                                    sm:w-[45%] 
                                    lg:w-[30%] 
                                    xl:w-[23%]`}>
                        {cargandoImgIndice === indice && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-md z-20">
                            <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <img className="rounded-md w-full h-80 object-cover" 
                        
                            src={p.imagenFondo}/>
                            {editar && (
                                <button
                                onClick={() => document.getElementById('imgProyecto-' + indice).click()}
                                className="flex items-center justify-center absolute -top-7 right-7 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                                >
                                <i className="fa-solid fa-image text-sm" />
                                </button>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => manejarCambioImagen(e, indice)}
                                className="hidden"
                                id={'imgProyecto-' + indice}
                            />
                        <div className={`flex flex-col items-center justify-between absolute inset-0
                                        rounded-md bg-black/50
                                        py-[10%] px-[5%] 
                                        ${editar == true ? 'lg:opacity-100' : 'lg:opacity-0 lg:hover:opacity-100'}`}>
                            <div className="text-center">
                                <h2 className={`font-semibold text-3xl outline-none text-[${p.colorTexto}]
                                                mb-2 
                                                sm:text-xl
                                                2xl:text-2xl`}
                                    contentEditable={editar}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => cambiarValorProyectos(indice, "titulo", e.currentTarget.textContent)}>
                                    {p.titulo}
                                </h2>
                                <div className={`flex flex-wrap justify-center gap-1 text-[${p.colorTexto}]
                                                text-[80%] font-sans
                                                md:text-sm`}>
                                    {p.etiquetas.map((e, indiceEtiqueta) => (
                                        <h6 key={indiceEtiqueta} className={`p-1 outline-none
                                                        bg-[${p.colorFondoEtiqueta}]
                                                        rounded-sm 
                                                        2xl:p-2`}
                                            contentEditable={editar}
                                            suppressContentEditableWarning={true}
                                            onBlur={(e) => cambiarTextoEtiqueta(indice, indiceEtiqueta, e.currentTarget.textContent)}>
                                            {e.texto}
                                        </h6>
                                    ))}                                  
                                </div>
                            </div>
                            <button onClick={() => setIndiceProyectoActivo(indice)}
                                    className={`font-sans font-semibold text-xl text-[${p.colorTexto}]
                                                border-2
                                                px-5 py-1
                                                ${editar == true ? `bg-[${p.colorBoton}]` : `hover:bg-[${p.colorBoton}]`}
                                                hover:cursor-pointer     
                                                sm:px-6 sm:py-2 
                                                lg:text-lg`}>
                                Ver Más
                            </button>


                            {editar && (
                              <button
                              onClick={(e) =>
                              abrirSelectorColor(e, config.proyectos[indice].colorTexto, (nuevoColor) => {
                                  actualizarColorProyecto(indice, nuevoColor, "colorTexto");
                                  }, {
                                  vertical: "abajo",
                                  horizontal: "derecha"
                              })
                              }


                              className="flex items-center justify-center absolute right-13 top-1 cursor-pointer
                                          bg-white p-1 rounded-full hover:bg-pink-400"
                              >
                              <i className="fa-solid fa-palette text-sm" />
                              </button>
                            )}

                            {editar && (
                              <button
                              onClick={(e) =>
                              abrirSelectorColor(e, config.proyectos[indice].colorFondoEtiqueta || "#1a5fad", (nuevoColor) => {
                                  actualizarColorProyecto(indice, nuevoColor, 'colorFondoEtiqueta');
                                  }, {
                                  vertical: "abajo",
                                  horizontal: "derecha"
                              })
                              }


                              className="flex items-center justify-center absolute right-7 top-1 cursor-pointer
                                          bg-white p-1 rounded-full hover:bg-pink-400"
                              >
                              <i className="fa-solid fa-tag text-sm" />
                              </button>
                            )}

                            {editar && (
                              <button
                              onClick={(e) =>
                              abrirSelectorColor(e, config.proyectos[indice].colorBoton, (nuevoColor) => {
                                  actualizarColorProyecto(indice, nuevoColor, "colorBoton");
                                  }, {
                                  vertical: "abajo",
                                  horizontal: "derecha"
                              })
                              }


                              className="flex items-center justify-center absolute right-1 top-1 cursor-pointer
                                          bg-white p-1 rounded-full hover:bg-pink-400"
                              >
                              <i className="fa-solid fa-square text-sm" />
                              </button>
                            )}

                            {editar && (
                                <button
                                onClick={() => eliminarProyecto(indice)}
                                className="flex items-center justify-center absolute -top-7 right-1 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                                >
                                <i className="fa-solid fa-trash text-sm" />
                                </button>
                            )}
                      
                        </div>                                                          
                    </div>
                ))}

                {editar && (
                  <div className={`w-[100%]
                                  sm:w-[45%] 
                                  lg:w-[30%] 
                                  xl:w-[23%]`}>
                    <button
                      onClick={agregarProyecto}
                      className="w-full h-full aspect-[3/2] bg-white rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 border-2 border-dashed border-gray-400"
                    >           
                      <i className="fa-solid fa-plus text-3xl text-gray-600" />
                    </button>
                  </div>
                )}         
            </div>
        </div>

        {indiceProyectoActivo !== null && (            
            <VistaProyecto 
              cerrar={cerrarVista} 
              contenido={config.proyectos[indiceProyectoActivo]} 
              editar={editar} 
              actualizarProyecto={actualizarProyecto}/>
        )}

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
                      desactivarModuloPorKey('proyectos')
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
