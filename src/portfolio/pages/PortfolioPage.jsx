import { Perfil, AdminNavbar, Navbar, Conocimientos, Experiencia, Contacto, Proyectos, Footer, AgregarModulo } from '..';
import { useAuthStore, usePortfolioStore } from '../../hooks';
import { MODULOS_CONFIG } from '../../config/modulos';

const MODULOS_PERMITIDOS = ['conocimientos', 'experiencia', 'proyectos', 'contacto'];

export const PortfolioPage = () => {
  const { estado } = useAuthStore();
  const { edicion, modulosOrden, modulosActivos } = usePortfolioStore();

  const finalOrden = modulosOrden.filter(key => modulosActivos[key]);

  const modulosInactivos = MODULOS_PERMITIDOS.filter(key => !modulosActivos[key]);

  const COMPONENTES_MAP = {
    conocimientos: Conocimientos,
    experiencia: Experiencia,
    proyectos: Proyectos,
    contacto: Contacto,
  };

  return (
    <>
      {estado === 'logeado' && <AdminNavbar />}

      <Navbar 
        config={MODULOS_CONFIG.navbar} 
        modulosConfig={MODULOS_CONFIG} 
        editar={edicion} 
      />

      <Perfil 
        config={MODULOS_CONFIG.perfil} 
        editar={edicion} 
      />

      {finalOrden.map((key) => {
        const Componente = COMPONENTES_MAP[key];
        return Componente ? (
          <Componente key={key} config={MODULOS_CONFIG[key]} editar={edicion} />
        ) : null;
      })}

      {edicion && modulosInactivos.length > 0 && (
        <AgregarModulo config={MODULOS_CONFIG} />
      )}

      <Footer />
    </>
  );
};