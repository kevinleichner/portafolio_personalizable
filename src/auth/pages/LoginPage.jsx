import {useEffect, useState} from 'react'
import { useAuthStore, useForm } from '../../hooks';
import Swal from 'sweetalert2';

const camposLogeo = {
    emailLogeo: '',
    claveLogeo: '',
}

const camposRegistro = {
    nombreRegistro: '',
    emailRegistro: '',
    claveRegistro: '',
    segundaClaveRegistro: '',
}

const camposRecuperar = {
    emailRecuperar: '',
    codigoRecuperar: '',
    nuevaClaveRecuperar: '',
    segundaNuevaClaveRecuperar: '',
}

export const LoginPage = () => {
    const [registro, setRegistro] = useState(false);
    const [recuperar, setRecuperar] = useState(false);
    const { empezarLogeo, mensajeError, empezarRegistro } = useAuthStore();

    const {emailLogeo, claveLogeo, cambiarInput:cambiarInputLogeo } = useForm(camposLogeo);
    const {nombreRegistro, emailRegistro, claveRegistro, segundaClaveRegistro, cambiarInput:cambiarInputRegistro } = useForm(camposRegistro);
    const {emailRecuperar, codigoRecuperar, nuevaClaveRecuperar, segundaNuevaClaveRecuperar } = useForm(camposRecuperar);

    const logeoSubmit = (event) => {
        event.preventDefault();
        empezarLogeo({email: emailLogeo, clave: claveLogeo})
    }

    const registroSubmit = (event) => {
        event.preventDefault();
        if (claveRegistro !== segundaClaveRegistro ) {
            Swal.fire('Error en registro', 'Contraseñas no son iguales', 'error');
            return;
        }
        empezarRegistro({nombre: nombreRegistro, email: emailRegistro, clave: claveRegistro});
    }

    const recuperarSubmit = (event) => {

    }

    useEffect(() => {
        if ( mensajeError !== undefined ) {
          Swal.fire('Error en la autenticación', errorMessage, 'error');
        }
      
      }, [mensajeError])


  return (
    <div  className="flex items-center gap-5 justify-around flex-col
                    bg-[#7eb77f]
                    h-[100vh]
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
            <h2 className="text-4xl
                            md:text-3xl 
                            xl:text-4xl">
                {registro && !recuperar ? "Registro" : recuperar ? "Recuperar Contraseña" : "Iniciar Sesión"} 
            </h2>           
            <form className="flex flex-col gap-2 items-center"
                  onSubmit={registro && !recuperar ? registroSubmit : recuperar ? recuperarSubmit : logeoSubmit}>     
                <div className="flex flex-col
                                w-full">
                    <input className="border-2 outline-none
                                        text-sm
                                        p-2 w-[100%] 
                                        sm:text-md" 
                            type="email" 
                            placeholder="Correo"
                            name="emailLogeo"
                            value={registro && !recuperar ? emailRegistro : recuperar ? emailRecuperar : emailLogeo}
                            onChange={registro ? cambiarInputRegistro : cambiarInputLogeo}
                            required/>
                    <label className={`self-start text-left 
                                       text-[12px]
                                       ${recuperar ? "" : "hidden"}`}>
                        <i className="fa-solid fa-circle-info 
                                       mr-1"
                        />
                        Si tu correo pertenece a una cuenta existente, te llegarán las instrucciones.
                    </label>
                </div>                       
                <input className={`border-2 outline-none
                                    text-sm
                                    p-2 w-[100%] 
                                    sm:text-md
                                    ${recuperar ? "hidden" : ""}`} 
                        type="password"
                        placeholder="Contraseña" 
                        name="claveLogeo"
                        value={registro ? claveRegistro : claveLogeo}
                        onChange={registro ? cambiarInputRegistro : cambiarInputLogeo}
                        required/>
                <input className={`border-2 outline-none 
                                    text-sm
                                    p-2 w-[100%] 
                                    sm:text-md
                                    ${registro && !recuperar ? "" : "hidden"}`} 
                        type="password"
                        placeholder="Repetir contraseña" 
                        name="claveLogeo"
                        value={segundaClaveRegistro}
                        onChange={cambiarInputRegistro}
                        required/>
                <input className="self-end
                                    border-2
                                    text-sm
                                    p-2 w-[30%] 
                                    sm:text-md sm:w-[25%] 
                                    md:w-[40%] 
                                    xl:w-[25%] 
                                    hover:cursor-pointer hover:bg-[#7eb77f] hover:text-white hover:border-black" 
                        type="submit" 
                        value={registro && !recuperar ? "Registrar" : recuperar ? "Enviar" : "Ingresar"} />
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
        {/* RECUPERAR CONTRASEÑA */}
        {/* <div className={`${registro ? "hidden" : ""} flex flex-col gap-10 text-center decoration-none w-[35%] bg-white px-8 py-15 shadow-xl font-sans`}>
            <h2 className="text-4xl">Recuperar Contraseña</h2>          
            <form className="flex flex-col gap-2 items-center">
                <p>Si tu correo pertenece a una cuenta existente, te llegarán las instrucciones.</p>
                <input className="border-2 p-2 w-[100%] outline-none" type="email" placeholder="Correo" required/>
                <input className="border-2 p-2 w-[25%] self-end hover:cursor-pointer hover:bg-[#7eb77f] hover:text-white hover:border-black" type="submit" value="Enviar" />
            </form>
            <div>
                <p>Volver para <a className="text-[#7eb77f] font-bold hover:underline" href="#">Iniciar Sesión</a></p>
            </div>
        </div> */}
    </div>
  )
}
