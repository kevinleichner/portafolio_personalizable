import { Perfil, AdminNavbar, Navbar, Conocimientos, Experiencia, Contacto, Proyectos, Footer, AgregarModulo } from '..';
import { useAuthStore, usePortfolioStore } from '../../hooks';

const MODULOS_PERMITIDOS = ['conocimientos', 'experiencia', 'proyectos', 'contacto'];

export const PortfolioPage = () => {
  const { estado } = useAuthStore();
  const { edicion, modulosOrden, modulosActivos, configLocal } = usePortfolioStore();

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
  );
};