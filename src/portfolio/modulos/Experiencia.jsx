import { SelectorColor } from "../components/SelectorColor";
import { useSelectorColor, usePortfolioStore } from '../../hooks';
import { tarjetaExperienciaDefecto } from "../modulosDefecto";
import Swal from "sweetalert2";

export const Experiencia = ({config, editar}) => {

    const componente = 'experiencia';

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

  const actualizarColorTarjeta = (indice, nuevoColor, propiedad = 'colorFondo') => {
      const nuevasTarjetas = [...config.tarjetas];
      nuevasTarjetas[indice] = {
        ...nuevasTarjetas[indice],
        [propiedad]: nuevoColor,
      };

      actualizarConfigLocal({
        key: componente,
        propiedad: 'tarjetas',
        valor: nuevasTarjetas,
      });
  };

  const cambiarValorTarjetas = (indice, campo, valor) => {
    const nuevasTarjetas = [...config.tarjetas];
    nuevasTarjetas[indice] = { ...nuevasTarjetas[indice], [campo]: valor };  
    
    actualizarConfigLocal({
      key: componente,
      propiedad: 'tarjetas',
      valor: nuevasTarjetas,
    });
  };

  const eliminarTarjeta = (indice) => {
    const nuevasTarjetas = config.tarjetas.filter((_, i) => i !== indice);
    
     actualizarConfigLocal({
      key: componente,
      propiedad: 'tarjetas',
      valor: nuevasTarjetas,
    });
  };

  const agregarTarjeta = () => {
        
    const nuevaTarjeta = tarjetaExperienciaDefecto;

    const nuevasTarjetas = [...config.tarjetas, nuevaTarjeta]

    actualizarConfigLocal({
      key: componente,
      propiedad: 'tarjetas',
      valor: nuevasTarjetas,
    });
  };  

  return (
    <div className={`text-center relative
                    bg-[${config.colorFondo}]
                    py-10 
                    sm:py-20 ]`} 
        id={config.id}>

        <div className="w-[85%] mx-auto">

          <div className={`flex items-start gap-2 justify-${config.alineacionTitulo} relative`}>

            <h2 className={`select-none outline-none text-[${config.colorTitulo}]
                            mb-10 
                            text-4xl font-semibold
                            sm:text-5xl`}
                spellCheck={false}
                contentEditable={editar}
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
                      horizontal: 'derecha'
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

            {config.tarjetas.map((t, indice) => (
                <div key={indice} className={`flex justify-between relative
                                shadow-md bg-[${t.colorFondo}]
                                border-t-2
                                mx-auto mt-2 p-2 
                                sm:border-0 sm:p-10`}>
                    <div className={`flex flex-col text-start gap-2 text-[${t.colorTexto}]
                                    p-2
                                    sm:border-l-2`}>
                        <h3 className="text-2xl outline-none font-semibold
                                        sm:text-3xl"
                            contentEditable={editar}
                            spellCheck={false}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => {
                              const texto = e.currentTarget.textContent.trim();

                              if (texto.length === 0) {
                                e.currentTarget.textContent = t.puesto;
                                Swal.fire({
                                  icon: "warning",
                                  title: "El Título de la tarjeta no puede quedar vacío",
                                  showConfirmButton: true,
                                  confirmButtonText: "Aceptar"
                                });
                              } 
                              else {
                                cambiarValorTarjetas(indice, "puesto", e.currentTarget.textContent)
                              }
                            }}
                        >
                          {t.puesto}
                        </h3>
                     
                        <h5 className="text-lg outline-none
                                        sm:text-xl"
                            spellCheck={false}
                            contentEditable={editar}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => cambiarValorTarjetas(indice, "empresa", e.currentTarget.textContent)}
                        >
                          {t.empresa}
                        </h5>
                        <p className="text-sm outline-none
                                        sm:text-md"
                            spellCheck={false}
                            contentEditable={editar}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => cambiarValorTarjetas(indice, "tiempo", e.currentTarget.textContent)}>
                            {t.tiempo}
                        </p>
                        <p className="lg:text-lg outline-none"
                            spellCheck={false}
                            contentEditable={editar}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => cambiarValorTarjetas(indice, "descripcion", e.currentTarget.textContent)}>
                            {t.descripcion}
                        </p>
                    </div>

                    {editar && (
                        <button
                          title="Eliminar tarjeta"
                          onClick={() => eliminarTarjeta(indice)}
                          className="flex items-center justify-center absolute top-1 right-1 bg-white p-1 rounded-full cursor-pointer hover:bg-red-500"
                        >
                          <i className="fa-solid fa-trash text-sm" />
                        </button>
                    )}

                    {editar && (
                        <button
                          title="Cambiar color del fondo"
                          onClick={(e) =>
                          abrirSelectorColor(e, config.tarjetas[indice].colorFondo, (nuevoColor) => {
                            actualizarColorTarjeta(indice, nuevoColor, "colorFondo");
                            }, {
                            vertical: "abajo",
                            horizontal: "izquierda"
                          })
                        }


                          className="flex items-center justify-center absolute right-7 top-1 cursor-pointer
                                    bg-white p-1 rounded-full hover:bg-pink-400"
                        >
                          <i className="fa-solid fa-paint-roller text-sm" />
                        </button>
                      )}


                    {editar && (
                        <button
                          title="Cambiar color del texto"
                          onClick={(e) =>
                          abrirSelectorColor(e, config.tarjetas[indice].colorTexto, (nuevoColor) => {
                            actualizarColorTarjeta(indice, nuevoColor, "colorTexto");
                            }, {
                            vertical: "abajo",
                            horizontal: "izquierda"
                          })
                        }


                          className="flex items-center justify-center absolute right-13 top-1 cursor-pointer
                                    bg-white p-1 rounded-full hover:bg-pink-400"
                        >
                          <i className="fa-solid fa-palette text-sm" />
                        </button>
                      )}                     
                </div>
              ))}
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

      {editar && (
        <div className={`w-[100%] 
                        sm:w-[85%] 
                        mx-auto mt-2
                        h-[calc(100%/3)]`}>
          <button
            title="Agregar tarjeta"
            onClick={agregarTarjeta}
            className="w-full h-full bg-white rounded-sm flex items-center justify-center cursor-pointer hover:bg-gray-200 border-2 border-dashed border-gray-400"
          >
            <i className="fa-solid fa-plus text-3xl text-gray-600" />
          </button>
        </div>
      )}

      {editar === true && (
        <button title="Eliminar módulo" onClick={(e) =>
                      desactivarModuloPorKey('experiencia')
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
