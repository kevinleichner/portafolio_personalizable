import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Perfil, AdminNavbar, Navbar, Conocimientos, Experiencia, Contacto, Proyectos, Footer, AgregarModulo } from '..';
import { useAuthStore, usePortfolioStore } from '../../hooks';
import { getVariablesEntorno } from '../../helpers/getVariablesEntorno';
import Swal from 'sweetalert2';

const {VITE_URL_BASE} = getVariablesEntorno();
const MODULOS_PERMITIDOS = ['conocimientos', 'experiencia', 'proyectos', 'contacto'];

export const PortfolioPage = () => {
  const { urlUsuario } = useParams();
  const { estado, usuario } = useAuthStore();
  const { 
    noEncontrada,
    cargando, 
    edicion,
    actualizarConfigLocal,
    empezarGuardarCambios,
    modulosOrden, 
    modulosActivos, 
    configLocal, 
    hayCambios, 
    obtenerRepositorioUsuario,
    mensajeError 
  } = usePortfolioStore();

  const finalOrden = modulosOrden.filter(key => modulosActivos[key]);

  const modulosInactivos = MODULOS_PERMITIDOS.filter(key => !modulosActivos[key]);

  const COMPONENTES_MAP = {
    conocimientos: Conocimientos,
    experiencia: Experiencia,
    proyectos: Proyectos,
    contacto: Contacto,
  };

  useEffect(() => {
    if (!urlUsuario) return; 
    obtenerRepositorioUsuario(urlUsuario);
  }, [urlUsuario]);

  useEffect(() => {
    if (!usuario?.uid) return;
    const cargarConfig = async () => {
      await obtenerRepositorioUsuario(usuario.uid);
    };
    cargarConfig();
  }, [usuario.uid]);

  useEffect(() => {
    if ( mensajeError !== undefined ) {
      Swal.fire('Aviso', mensajeError, 'warning');
    }
  
  }, [mensajeError])

  const cerrarCartel = async () =>{
    const nuevoConfig = {
      ...configLocal,
      mostrarCartel: false
    }

    actualizarConfigLocal({
      key: 'mostrarCartel',
      valor: false
    })

    await empezarGuardarCambios(usuario.uid, nuevoConfig);
  }

  return (
    <>

    {(configLocal.mostrarCartel == true && !cargando && !noEncontrada && estado == 'logeado' )&& (
        <div className="fixed inset-0 flex text-center justify-center items-center z-50
                      bg-black/70">
          <div className={`gap-2 p-2 flex justify-center flex-col items-center bg-[#184e47]
                      rounded-sm max-h-[95vh] max-w-[90%]
                      shadow-xl`}>
            <img className="object-contain max-h-[85vh] max-w-[100%] rounded-sm"  src="/img/cartel.png" alt="" />
            <button 
                onClick={cerrarCartel}
                className='border-2 rounded p-1 px-3 bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-600'>
              Entendido
            </button>                     
          </div>
        </div>
      )}  

      {cargando ? (        
        <div className='flex items-center justify-center h-[100vh] bg-[#7eb77f]'>
          <h3 className='text-2xl text-white md:text-4xl'>
            Cargando...
          </h3>
        </div>
      ) : noEncontrada ? (        
        <div className='flex flex-col items-center justify-center h-[100vh] bg-[#7eb77f]'>
          <h3 className='text-2xl text-white md:text-4xl'>
            Página no encontrada.
          </h3>
          <p className='text-xl md:text-2xl'>
            Ir al{" "}
            <a href={VITE_URL_BASE} className="text-[#008080] hover:underline hover:underline-offset-6 hover:decoration-2">
              inicio
            </a>
          </p>
        </div>            
      ) : (
        <>
          {estado === 'logeado' &&  
            <AdminNavbar 
              editar={edicion}
              hayCambios={hayCambios}
              config={configLocal}
            />
          }

          <Navbar 
            config={configLocal.navbar}
            modulosConfig={configLocal} 
            modulosOrden={finalOrden}
            editar={edicion} 
          />

          <Perfil 
            config={configLocal.perfil} 
            editar={edicion} 
          />

          {finalOrden.map((key) => {
            const Componente = COMPONENTES_MAP[key];
            return Componente ? (
              <Componente key={key} config={configLocal[key]} editar={edicion} />
            ) : null;
          })}

          {edicion && modulosInactivos.length > 0 && (
            <AgregarModulo config={configLocal} />
          )}

          <Footer />
        </>
      )}
    </>
  );
};