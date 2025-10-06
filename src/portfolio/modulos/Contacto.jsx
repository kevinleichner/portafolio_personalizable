import { SelectorColor } from "../components/SelectorColor";
import { useSelectorColor, usePortfolioStore, useEmailStore } from '../../hooks';
import Swal from 'sweetalert2';
import { useEffect } from "react";

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
  const { enviarMail, enviando } = useEmailStore();

  useEffect(() => {
  if (config.activo && (!config.email || config.email.trim() === '')) {
    manejarCambioMail();
  }
}, [config.activo]);

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

  const manejarCambioMail = async() => {
    const { value: nuevoMail, isConfirmed: confirmado } = await Swal.fire({
      title: 'Dirección de email receptor:',
      input: 'email',
      inputValue: config.email,
      inputLabel: 'Aquí llegaran los mensajes de contacto',
      inputPlaceholder: 'ejemplo@gmail.com',
      inputAttributes: {
        required: true
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Tenés que ingresar un email';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Ingresá un email válido (por ejemplo: ejemplo@gmail.com)';
        }

        return null; // ✅ válido
      }
    });

    if(confirmado && nuevoMail != config.email){  
      actualizarConfigLocal({
        key: componente,
        propiedad: 'email',
        valor: nuevoMail
      })
    }
    else if (!config.email || config.email.trim() === '') {
      desactivarModuloPorKey(componente)
    }
  }
    
  const manejarEnvioMail = async (e) => {
    e.preventDefault();

    const form = e.target;
    const nombre = form.nombre.value.trim();
    const correoEmisor = form.correo.value.trim();
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !correoEmisor || !mensaje) {
      Swal.fire('Error', 'Completá todos los campos antes de enviar', 'error');
      return;
    }

    const respuesta = await enviarMail({
      nombre,
      correoEmisor, 
      mensaje, 
      correoReceptor: config.email
    });

    if (respuesta.ok) {
      Swal.fire('Enviado', respuesta.msg, 'success');
      form.reset();
    } else {
      Swal.fire('Error', respuesta.msg || 'No se pudo enviar el correo', 'error');
    }
  };

  return (
    <div className={`relative
                      text-center font-sans
                      bg-[${config.colorFondo}]
                      py-10 
                      sm:py-20`} 
          id={config.id}>       
        <div className="w-[85%] mx-auto">
          <div className={`flex items-start gap-2 justify-${config.alineacionTitulo} relative`}>
            <h2 className={`select-none text-[${config.colorTitulo}] outline-none
                            text-4xl font-semibold
                            mb-10    
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
                      horizontal: window.innerWidth < 768 ? 'izquierda' : 'derecha'
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
          <div className="relative">
            <form onSubmit={manejarEnvioMail} className="flex flex-wrap justify-between flex-col
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
                          required
                          name="mensaje" 
                          placeholder="Mensaje" 
                          spellCheck="false"/>
                <div className={`relative w-full flex justify-center ${editar && 'mt-7'}`}>
                  <input
                    title="Enviar email"
                    disabled={enviando}
                    className={`outline rounded-sm bg-[${config.colorBoton}]
                                font-semibold text-[${config.colorTextoBoton}]
                                ${enviando ? "bg-gray-500" : "hover:cursor-pointer hover:brightness-80"}
                                py-[2%] w-[30%]
                                sm:py-[1%] 
                                sm:w-[15%] 
                                lg:w-[10%] `} 
                    type="submit" 
                    value="Enviar"
                  />

                  {editar && (
                    <>
                      <button
                        title="Cambiar color del texto"
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
                        title="Cambiar color del botón"
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
              title="Cambiar color de bordes"
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
          <button title="Cambiar dirección de email" onClick={(e) => manejarCambioMail()}
                  className={`absolute right-18 top-3 cursor-pointer flex items-center
                                bg-white rounded-full p-2 
                                hover:bg-blue-400
                                xl:right-23`}>
                <i className="fa-solid fa-at text-sm
                              xl:text-xl"/>
          </button>
        )}

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

        {editar === true && (
          <button title="Eliminar módulo"  onClick={(e) =>
                        desactivarModuloPorKey(componente)
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
