import {useEffect, useState} from 'react'
import { useAuthStore, useForm } from '../../hooks';
import Swal from 'sweetalert2';

const camposLogeo = {
    usuarioLogeo: '',
    claveLogeo: '',
}

const camposRegistro = {
    usuarioRegistro: '',
    claveRegistro: '',
    segundaClaveRegistro: '',
    codigoRegistro: '',
}

const camposRecuperar = {
    usuarioRecuperar: '',
    codigoRecuperar: '',
    nuevaClaveRecuperar: '',
    segundaNuevaClaveRecuperar: '',
}

export const LoginPage = () => {
    const [registro, setRegistro] = useState(false);
    const [recuperar, setRecuperar] = useState(false);
    const { empezarLogeo, empezarRegistro, empezarRecuperacion, mensajeError, mensajeExitoso, estado } = useAuthStore();

    const {usuarioLogeo, claveLogeo, cambiarInput:cambiarInputLogeo, resetearFormulario:resetearFormularioLogeo } = useForm(camposLogeo);
    const {usuarioRegistro, codigoRegistro, claveRegistro, segundaClaveRegistro, cambiarInput:cambiarInputRegistro, resetearFormulario:resetearFormularioRegistro } = useForm(camposRegistro);
    const {usuarioRecuperar, codigoRecuperar, nuevaClaveRecuperar, segundaNuevaClaveRecuperar, cambiarInput:cambiarInputRecuperar, resetearFormulario:resetearFormularioRecuperar } = useForm(camposRecuperar);

    const logeoSubmit = async(event) => {
        event.preventDefault();
        await empezarLogeo({usuario: usuarioLogeo, clave: claveLogeo})
    }

    const registroSubmit = async(event) => {
        event.preventDefault();
        if (claveRegistro.length < 6 ) {
            return Swal.fire('Aviso', 'La contraseña debe tener min. 6 dígitos', 'warning');
        }
        if (claveRegistro !== segundaClaveRegistro ) {
            return Swal.fire('Aviso', 'Las contraseñas no son iguales.', 'warning');
        }
        if (codigoRegistro.length < 4) {
            return Swal.fire('Aviso', 'El código de seguridad debe tener entre 4 y 6 dígitos.', 'warning');
        }
        await empezarRegistro({usuario: usuarioRegistro, codigo: codigoRegistro, clave: claveRegistro});
    }

    const recuperarSubmit = async(event) => {
        event.preventDefault();
        if (nuevaClaveRecuperar.length < 6 ) {
            return Swal.fire('Aviso', 'La contraseña debe tener min. 6 dígitos', 'warning');
        }
        if (nuevaClaveRecuperar !== segundaNuevaClaveRecuperar ) {
            return Swal.fire('Aviso', 'Las contraseñas no son iguales', 'warning');
        }
        if (codigoRecuperar.length < 4) {
            return Swal.fire('Aviso', 'El código de seguridad debe tener entre 4 y 6 dígitos.', 'warning');
        }
        await empezarRecuperacion({usuario: usuarioRecuperar, codigo: codigoRecuperar, nuevaClave: nuevaClaveRecuperar});     
    }

    const reiniciarPagina = () => {
        setRecuperar(false);
        setRegistro(false);
        resetearFormularioLogeo();
        resetearFormularioRegistro();
        resetearFormularioRecuperar();
    }

    useEffect(() => {
        if ( mensajeError !== undefined ) {
          Swal.fire('Error', mensajeError, 'error');
        }
      
      }, [mensajeError])

    useEffect(() => {
        if ( mensajeExitoso !== undefined ) {
            Swal.fire('Todo OK!', mensajeExitoso, 'success');
            reiniciarPagina();
        }
        
        }, [mensajeExitoso])   

    return (
        
        <div  className="flex items-center gap-5 justify-around flex-col
                        bg-[#7eb77f]
                        md:h-[100vh]
                        md:gap-0 md:flex-row md:bg-linear-to-r md:from-white md:from-54% md:to-[#7eb77f] md:to-46%
                        xl:from-57% xl:to-43%">
            <div className="text-center order-2 
                            p-4 h-[50%] w-[100%]
                            md:p-0 md:h-[auto] md:w-[50%] md:order-1">
                <h1 className="text-xl 
                                mb-5
                                sm:text-3xl 
                                md:text-2xl 
                                xl:text-3xl">
                    Portafolio Personalizable
                </h1>
                <h2 className="text-3xl text-white
                                mb-5
                                sm:text-6xl 
                                md:text-4xl md:text-[#7eb77f]
                                xl:text-6xl">
                    ¡Haz que tu portafolio hable por vos!
                </h2>
                <p className="text-sm 
                                sm:text-lg">
                    Con nuestro sistema de módulos, puedes agregar secciones personalizadas para destacar lo que realmente 
                    importa: habilidades, redes sociales, contacto, trabajos destacados y más. Ajusta colores, fuentes, tamaños 
                    y fondos a tu estilo para lograr un diseño que refleje tu identidad.         
                </p>
            </div>
            {/* INICIAR SESION */}
            <div className={`flex flex-col gap-10 text-center order-1
                            decoration-none bg-white shadow-xl
                            font-sans
                            h-[50%] w-[100%] px-8 py-15
                            md:h-[auto] md:w-[40%] md:order-2
                            xl:w-[35%]`}>
                <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                        <h2 className="text-4xl md:text-3xl xl:text-4xl mb-2">
                        {registro && !recuperar
                            ? "Registro"
                            : recuperar
                            ? "Restablecer Contraseña"
                            : "Iniciar Sesión"}
                        </h2>

                        <div className={`relative w-40 h-1 bg-gray-200 overflow-hidden ${estado == 'pendiente' ? "" : "invisible"} rounded`}>
                            {estado === "pendiente" && (
                                <div className="absolute top-0 left-0 w-full h-full bg-blue-500 animate-[slide_1.5s_linear_infinite]" />
                            )}
                        </div>
                    </div>
                </div>
                <form className="flex flex-col gap-2 items-center"
                    onSubmit={registro && !recuperar ? registroSubmit : recuperar ? recuperarSubmit : logeoSubmit}>     
                    <div className="flex flex-col
                                    w-full">
                        <input className="border-2 outline-none
                                            text-sm
                                            p-2 w-[100%] 
                                            sm:text-md" 
                                type="text" 
                                placeholder="Usuario"
                                name={registro && !recuperar ? "usuarioRegistro" : recuperar ? "usuarioRecuperar" : "usuarioLogeo"}
                                value={registro && !recuperar ? usuarioRegistro : recuperar ? usuarioRecuperar : usuarioLogeo}
                                onChange={registro && !recuperar ? cambiarInputRegistro : recuperar ? cambiarInputRecuperar : cambiarInputLogeo}
                                required/>                   
                    </div>                       
                    <input className={`border-2 outline-none
                                        text-sm
                                        p-2 w-[100%] 
                                        sm:text-md`} 
                            type="password"
                            placeholder={recuperar ? "Nueva contraseña" :"Contraseña"} 
                            name={registro && !recuperar ? "claveRegistro" : recuperar ? "nuevaClaveRecuperar" : "claveLogeo"}
                            value={registro && !recuperar ? claveRegistro : recuperar ? nuevaClaveRecuperar : claveLogeo}
                            onChange={registro && !recuperar ? cambiarInputRegistro : recuperar ? cambiarInputRecuperar : cambiarInputLogeo}
                            required/>
                    {(registro || recuperar) && (
                        <div className='flex flex-col gap-2 w-full'>                  
                            <input className={`border-2 outline-none 
                                                text-sm
                                                p-2 w-[100%] 
                                                sm:text-md}`}
                                    type="password"
                                    placeholder={recuperar ? "Repetir nueva contraseña" : "Repetir contraseña"} 
                                    name={registro && !recuperar ? "segundaClaveRegistro" : "segundaNuevaClaveRecuperar"}
                                    value={registro && !recuperar ? segundaClaveRegistro : segundaNuevaClaveRecuperar}
                                    onChange={registro && !recuperar ? cambiarInputRegistro : cambiarInputRecuperar}
                                    required/>                                
                            <input className={`border-2 outline-none
                                                text-sm
                                                p-2 w-[100%] 
                                                sm:text-md
                                                ${registro || recuperar ? "" : "hidden"}`} 
                                    type="text"
                                    placeholder="Código de seguridad (numérico)" 
                                    name={registro && !recuperar ? "codigoRegistro" : "codigoRecuperar"}
                                    value={registro && !recuperar ? codigoRegistro : codigoRecuperar}
                                    onChange={registro && !recuperar ? cambiarInputRegistro : cambiarInputRecuperar}
                                    maxLength={6}
                                    minLength={4}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/\D/g, ''); // elimina todo lo que no sea número
                                    }}
                                    required/>      
                            <label className={`self-start text-left 
                                            text-[12px] mt-[-7px]
                                            ${registro && !recuperar ? "" : "hidden"}`}
                            >
                                <i className="fa-solid fa-circle-info 
                                                mr-1"
                                />
                                Este código servirá para recuperar tu contraseña en caso de olvidarla.
                            </label> 
                        </div>
                    )}           
                    <input className="self-end
                                        border-2
                                        text-sm
                                        p-2 w-[40%] 
                                        sm:text-md sm:w-[25%] 
                                        md:w-[40%] 
                                        xl:w-[25%] 
                                        hover:cursor-pointer hover:bg-[#7eb77f] hover:text-white hover:border-black" 
                            type="submit" 
                            value={registro && !recuperar ? "Registrar" : recuperar ? "Recuperar" : "Ingresar"} />                
                </form>
                <div className="text-sm 
                                sm:text-md 
                                md:text-sm 
                                xl:text-md">
                    <p>
                        {registro && !recuperar ? "¿Ya tienes cuenta?" : recuperar ? "Volver para" : "¿Todavía no tienes cuenta?"} 
                        <a  className="text-[#7eb77f] font-bold 
                                    hover:underline
                                    hover:cursor-pointer
                                    ml-1"
                            onClick={(e) => {
                                e.preventDefault(); 
                                {registro ? setRegistro(false) : setRegistro(true)} 
                                setRecuperar(false);
                            }}>
                            {registro || recuperar ? "Iniciar Sesión"  : "Registrate"} 
                        </a>
                    </p>
                    <a className={`text-[#7eb77f] font-bold 
                                    hover:underline
                                    hover:cursor-pointer
                                    ${recuperar ? "hidden" : ""}`} 
                        onClick={(e) => {
                            e.preventDefault(); 
                            setRegistro(true);
                            setRecuperar(true);
                        }}>
                        Olvidé mi contraseña
                    </a>
                </div>
            </div>
        </div>
    ) 
}
