import { useState, useEffect } from 'react';
import { Perfil, AdminNavbar, Navbar, Conocimientos, Experiencia, Contacto, Proyectos, Footer, AgregarModulo } from '..';
import { useAuthStore, usePortfolioStore } from '../../hooks';
import { MODULOS_CONFIG } from '../../config/modulos';

export const PortfolioPage = () => {
  const { estado } = useAuthStore();
  const { edicion, modulosOrden, modulosActivos } = usePortfolioStore();

  const modulosParaMostrar = modulosOrden.filter(key => modulosActivos[key]);

  const modulosNoEnOrden = Object.entries(MODULOS_CONFIG)
    .filter(([key]) => modulosActivos[key] && !modulosOrden.includes(key))
    .sort((a, b) => (a[1].orden ?? 0) - (b[1].orden ?? 0))
    .map(([key]) => key);

  const finalOrden = [...modulosParaMostrar, ...modulosNoEnOrden];

  const COMPONENTES = {
    conocimientos: <Conocimientos config={MODULOS_CONFIG.conocimientos} editar={edicion} />,
    experiencia: <Experiencia config={MODULOS_CONFIG.experiencia} editar={edicion} />,
    proyectos: <Proyectos config={MODULOS_CONFIG.proyectos} editar={edicion} />,
    contacto: <Contacto config={MODULOS_CONFIG.contacto} editar={edicion} />,
  };

  return (
    <>
      {estado === 'logeado' && <AdminNavbar />}
      <Navbar config={MODULOS_CONFIG.navbar} modulosConfig={MODULOS_CONFIG} editar={edicion} />
      <Perfil config={MODULOS_CONFIG.perfil} editar={edicion} />
      {finalOrden.map(moduloKey => (
        <div key={moduloKey}>{COMPONENTES[moduloKey]}</div>
      ))}
      {edicion && <AgregarModulo config={MODULOS_CONFIG} />}
      <Footer />
    </>
  );
};
