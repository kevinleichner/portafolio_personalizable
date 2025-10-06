import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Perfil, AdminNavbar, Navbar, Conocimientos, Experiencia, Contacto, Proyectos, Footer, AgregarModulo } from '..';
import { useAuthStore, usePortfolioStore } from '../../hooks';
import Swal from 'sweetalert2';

const MODULOS_PERMITIDOS = ['conocimientos', 'experiencia', 'proyectos', 'contacto'];

export const PortfolioPage = () => {
  const { urlUsuario } = useParams();
  const { estado, usuario } = useAuthStore();
  const { 
    noEncontrada,
    cargando, 
    edicion, 
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

  return (
    <>
      {cargando ? (        
        <div className='flex items-center justify-center h-[100vh] bg-[#7eb77f]'>
          <h3 className='text-2xl text-white md:text-4xl'>
            Cargando...
          </h3>
        </div>
      ) : noEncontrada ? (        
        <div className='flex items-center justify-center h-[100vh] bg-[#7eb77f]'>
          <h3 className='text-2xl text-white md:text-4xl'>
            Página no encontrada.
          </h3>
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