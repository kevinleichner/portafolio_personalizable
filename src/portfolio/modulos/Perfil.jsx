import { useState, useRef } from "react";
import { SelectorColor } from "../components/SelectorColor";
import { SelectorIcono } from "../components/SelectorIcono";
import { redSocialDefecto } from "../modulosDefecto";
import { useSelectorColor, useSelectorIcono, usePortfolioStore, useImagenes } from '../../hooks';
import { Icon } from '@iconify/react';
import Swal from "sweetalert2";

export const Perfil = ({ config, editar }) => {

  const componente = 'perfil';

  const {
    mostrarSelectorColor,
    posicionSelectorColor,
    colorInicial,
    botonColorRef,
    abrirSelectorColor,
    cerrarSelectorColor,
    manejarCambioColor,
  } = useSelectorColor();

  const {
    mostrarSelectorIcono,
    posicionSelectorIcono,
    selectorIconoRef,
    abrirSelectorIcono,
    manejarSeleccionIcono
  } = useSelectorIcono();

  const {subirImagen, cargandoImagen} = useImagenes();

  const {actualizarConfigLocal} = usePortfolioStore();

  const [mostrarUrls, setMostrarUrls] = useState(config.redesSociales.map(() => false));

  const urlRefs = useRef({});

  const actualizarTitulo = (nuevoTitulo) => {
    actualizarConfigLocal({
      key: componente,
      propiedad: 'titulo',
      valor: nuevoTitulo
    })
  }

  const actualizarDescripcion = (nuevaDescripcion) => {
    actualizarConfigLocal({
      key: componente,
      propiedad: 'descripcion',
      valor: nuevaDescripcion
    })
  }

  const manejarCambioAnchoBorde = () => {
    const anchoActual = parseInt(config.anchoBorde, 10);
    const nuevoAncho = anchoActual < 7 ? anchoActual + 1 : 1;

    actualizarConfigLocal({
      key: componente,
      propiedad: 'anchoBorde',
      valor: nuevoAncho
    })
  };

  const manejarCambioImagen = async(e) => {
    const archivo = e.target.files[0];
    if (!archivo || !archivo.type.startsWith("image/")) return;

    const url = await subirImagen(archivo, "imagenes_modulos"); 
    
    if (!url) return;

    actualizarConfigLocal({
      key: componente,
      propiedad: 'imagen',
      valor: url,
    });

  };


  const agregarRedSocial = () => {
      if (config.redesSociales.length >= 4) return config;

      const nuevaRed = redSocialDefecto;
      const nuevasRedesSociales = [...config.redesSociales, nuevaRed]

      actualizarConfigLocal({
        key: componente,
        propiedad: 'redesSociales',
        valor: nuevasRedesSociales
      })
  };

  const eliminarRedSocial = (indice) => {
      if (config.redesSociales.length <= 0) return config; // No elimina si no hay ninguna

      const nuevasRedesSociales = config.redesSociales.filter((_, i) => i !== indice);

      actualizarConfigLocal({
        key: componente,
        propiedad: 'redesSociales',
        valor: nuevasRedesSociales
      })

  };

  const actualizarColorRedSocial = (indice, nuevoColor, propiedad = "colorIcono") => {
      const nuevasRedes = [...config.redesSociales];
      nuevasRedes[indice] = {
        ...nuevasRedes[indice],
        [propiedad]: nuevoColor,
      };

      actualizarConfigLocal({
        key: componente,
        propiedad: 'redesSociales',
        valor: nuevasRedes
      })
  };

  const actualizarUrlRedSocial = (indice, nuevaUrl) => {
      const nuevasRedes = [...config.redesSociales];
      nuevasRedes[indice] = {
        ...nuevasRedes[indice],
        url: nuevaUrl,
      };

      actualizarConfigLocal({
        key: componente,
        propiedad: 'redesSociales',
        valor: nuevasRedes
      })
  };

  const toggleMostrarUrl = (indice) => {
    setMostrarUrls((prev) => {
      const nueva = prev.map(() => false);
      nueva[indice] = !prev[indice];
      return nueva;
    });
  };

  return (
    <div className={`relative
                    bg-[${config.colorFondo}]
                    py-10 
                    m:py-20`}>                 

      <div className={`flex justify-between relative
                      border-${config.anchoBorde} border-[${config.colorBorde}]
                      mx-auto w-[85%]
                      select-none  
                      lg:w-[70%]`}>     

                      {editar && (
                        <>                       
                          <button
                            title="Cambiar color del borde"  
                            onClick={(e) =>
                              abrirSelectorColor(e, config.colorBorde, (nuevoColor) => {
                                actualizarConfigLocal({
                                  key: componente,
                                  propiedad: 'colorBorde',
                                  valor: nuevoColor
                                })
                              }, {
                                vertical: "abajo",
                                horizontal: "derecha"
                              })
                            }
                            className="flex items-center absolute -top-8 z-10 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                          >
                            <i className="fa-solid fa-palette text-sm" />
                          </button>

                          <button
                            title="Cambiar ancho del borde" 
                            onClick={manejarCambioAnchoBorde}
                            className="flex items-center absolute -top-8 left-7 z-10 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                          >
                            <i className="fa-solid fa-up-right-and-down-left-from-center text-sm"/>
                          </button>
                        </>
                      )}                     

          <div className="flex flex-col text-center 
                          w-[100%] 
                          md:w-[60%] md:justify-between md:text-start 
                          xl:w-[75%]">

            <div className="p-3">
              
              <div className="flex items-start gap-2 justify-center relative
                              md:justify-start">                
                
                <h1
                  className={`font-semibold tracking-tight outline-none text-4xl text-[${config.colorTitulo}]
                              md:text-5xl 
                              xl:text-6xl`}
                  contentEditable={editar}
                  spellCheck={false}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const texto = e.currentTarget.textContent.trim();

                    if (texto.length === 0) {
                      e.currentTarget.textContent = config.titulo;
                      Swal.fire({
                        icon: "warning",
                        title: "El Nombre no puede quedar vacío",
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
                </h1>

                {editar && (
                  <button
                    title="Cambiar color del título" 
                    onClick={(e) =>
                      abrirSelectorColor(e, config.colorTitulo, (nuevoColor) => {
                        actualizarConfigLocal({
                          key: componente,
                          propiedad: 'colorTitulo',
                          valor: nuevoColor
                        })
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
                )}    
              </div>            
              
              <div className="relative visible
                              h-auto mx-auto my-2 w-[60%] 
                              sm:w-[50%] 
                              md:object-cover md:hidden md:w-[35%]  
                              lg:w-[30%]
                              xl:w-[20%] 
                              2xl:object-contain">

              {cargandoImagen && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-md z-20">
                  <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              <img  
                src={`${config.imagen}`}/>
                {editar && (
                  <button
                    title="Cambiar imagen de perfil" 
                    onClick={() => document.getElementById("input-imagen-perfil").click()}
                    className="flex items-center justify-center absolute top-2 right-2 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                  >
                    <i className="fa-solid fa-image text-sm" />
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={manejarCambioImagen}
                  className="hidden"
                  id="input-imagen-perfil"
                />
                </div>

              <div className="flex items-start gap-2 justify-center relative
                              md:justify-start">  
                <p className={`h-auto outline-none text-[${config.colorTexto}]
                              sm:text-lg 
                              xl:text-xl`}
                    contentEditable={editar}
                    spellCheck={false}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => actualizarDescripcion(e.currentTarget.textContent)}>
                    {config.descripcion}
                </p>

                {editar && (
                    <button
                    title="Cambiar color de descripción" 
                    onClick={(e) =>
                      abrirSelectorColor(e, config.colorTexto, (nuevoColor) => {
                        actualizarConfigLocal({
                          key: componente,
                          propiedad: 'colorTexto',
                          valor: nuevoColor
                        })
                        }, {
                        vertical: "abajo",
                        horizontal: "derecha"
                      })
                    }


                      className="flex items-center justify-center cursor-pointer
                                bg-white p-1 rounded-full hover:bg-pink-400"
                    >
                      <i className="fa-solid fa-palette text-sm" />
                    </button>
                  )}

              </div> 
            </div>   

            <div className="p-2 flex mt-2 justify-center md:justify-start">
              {config.redesSociales.map((r, indice) => (
                <div key={indice} className="relative inline-block mx-1">
                  
                  {editar && (
                    <>
                      <button
                        title="Cambiar color del ícono" 
                        onClick={(e) =>
                          abrirSelectorColor(e, config.redesSociales[indice].colorIcono, (nuevoColor) => {
                            actualizarColorRedSocial(indice, nuevoColor);
                          }, 
                          indice < 2
                          ? { vertical: "arriba", horizontal: "derecha" } 
                          : { vertical: "arriba", horizontal: "izquierda" } )
                        }
                        className="flex items-center absolute -top-6 left-1/2 -translate-x-[120%] cursor-pointer
                                  bg-white p-1 rounded-full hover:bg-pink-400
                                  z-10"
                      >
                        <i className="fa-solid fa-palette text-sm" />
                      </button>                    

                      <button
                        title="Cambiar color del fondo" 
                        onClick={(e) =>
                          abrirSelectorColor(e, config.redesSociales[indice].colorFondo, (nuevoColor) => {
                            actualizarColorRedSocial(indice, nuevoColor, "colorFondo");
                          }, 
                          indice < 2 
                          ? { vertical: "arriba", horizontal: "derecha" } 
                          : { vertical: "arriba", horizontal: "izquierda" } )
                        }
                        className="flex items-center absolute -top-6 left-1/2 -translate-x-[-20%] cursor-pointer
                                  bg-white p-1 rounded-full hover:bg-pink-400
                                  z-10"
                      >
                        <i className="fa-solid fa-paint-roller text-sm" />
                      </button>

                      <button
                        title="Cambiar url" 
                        onClick={() => toggleMostrarUrl(indice)}
                        className="flex items-center absolute -bottom-6 left-1/2 -translate-x-[120%] cursor-pointer
                                  bg-white p-1 rounded-full hover:bg-pink-400
                                  z-10"
                      >
                        <i className="fa-solid fa-link text-sm" />
                      </button>

                      <button
                        title="Eliminar" 
                        onClick={(e) =>
                          eliminarRedSocial(indice)
                        }
                        className="flex items-center absolute -bottom-6 left-1/2 -translate-x-[-20%] cursor-pointer
                                  bg-white p-1 rounded-full hover:bg-red-500
                                  z-10"
                      >
                        <i className="fa-solid fa-trash text-sm" />
                      </button>

                     {mostrarUrls[indice] && (
                        <p
                          ref={(el) => (urlRefs.current[indice] = el)}
                          title={r.url}
                          className="absolute -bottom-15 left-1/2 -translate-x-1/2 z-10 outline-none
                                    bg-white p-1 rounded-sm w-48
                                    text-sm text-center
                                    whitespace-nowrap overflow-x-auto
                                    overflow-y-hidden
                                    border border-gray-300 shadow-sm
                                    hide-scrollbar"
                          contentEditable={editar}
                          spellCheck={false}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {urlRefs.current[indice]?.scrollTo({ left: 0 });
                          actualizarUrlRedSocial(indice, e.currentTarget.textContent);}}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              toggleMostrarUrl(indice); 
                              urlRefs.current[indice]?.blur(); 
                            }
                          }}
                        >
                          {r.url}
                        </p>
                      )}
                    </>
                    
                  )}

                  <a
                    href={editar === false ? (r.url.startsWith('http') ? r.url : `https://${r.url}`) : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (editar) {
                        e.preventDefault(); 
                      }
                    }}
                  >
                    {editar && (
                      <button
                        title="Cambiar ícono" 
                        onClick={(e) =>
                          abrirSelectorIcono(
                            e,
                            indice,
                            (nuevoIcono) => {
                                const nuevasRedes = [...config.redesSociales];
                                nuevasRedes[indice] = {
                                  ...nuevasRedes[indice],
                                  icono: nuevoIcono,
                                };

                                actualizarConfigLocal({
                                  key: componente,
                                  propiedad: 'redesSociales',
                                  valor: nuevasRedes
                                })
                            },
                            indice < 2
                              ? { vertical: "arriba", horizontal: "derecha" }
                              : { vertical: "arriba", horizontal: "izquierda" }
                          )
                        }
                        className="flex items-center justify-center absolute top-0 right-0 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                      >
                        <i className="fa-solid fa-image text-sm" />
                      </button>
                    )}

                    <Icon 
                      icon={r.icono} 
                      className={` text-[${r.colorIcono}]
                        rounded-sm p-2
                        bg-[${r.colorFondo}]
                        ${!editar && 'lg:bg-transparent lg:hover:bg-[' + r.colorFondo + ']'}
                        ${editar && 'md:bg-[' + r.colorFondo + ']'}
                        md:p-3
                      `}
                      width="52" 
                      height="52"
                    />

                  </a>                 
                </div>
              ))}


              {editar === true && config.redesSociales.length < 4 && (
                <button title="Agregar"  onClick={agregarRedSocial}>
                  <i className="fa-solid fa-plus fa-2x text-gray-500 cursor-pointer
                                rounded-sm border-2
                                p-2 ml-1
                                hover:text-black" />
                </button>
              )}
            </div>
          </div>

          <div className="relative hidden
                h-auto m-2 w-[50%]
                md:block md:w-[35%] 
                lg:w-[30%] 
                xl:w-[20%] 
                2xl:object-contain">

            {cargandoImagen && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20">
                <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <img
              className="object-cover w-full h-full"
              src={`${config.imagen}`}
            />

            {editar && (
              <button
                title="Cambiar imagen de perfil"
                onClick={() => document.getElementById("input-imagen-perfil").click()}
                className="flex items-center justify-center absolute top-2 right-2 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
              >
                <i className="fa-solid fa-image text-sm" />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={manejarCambioImagen}
              className="hidden"
              id="input-imagen-perfil"
            />
          </div>
          
      </div>

      {editar === true && (
        <button title="Cambiar color de fondo" 
                onClick={(e) =>
                      abrirSelectorColor(e, config.colorFondo, (nuevoColor) => {
                        actualizarConfigLocal({
                          key: componente,
                          propiedad: 'colorFondo',
                          valor: nuevoColor
                        })
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

      {mostrarSelectorIcono && editar && (
        <div
          ref={selectorIconoRef}
          style={{
            position: "absolute",
            top: posicionSelectorIcono.top,
            left: posicionSelectorIcono.left,
            zIndex: 1000
          }}
        >
          <SelectorIcono manejarSeleccionIcono={manejarSeleccionIcono} />
        </div>
      )}

    </div>
  )
}
