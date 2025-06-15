import { Perfil, AdminNavbar, Navbar, Conocimientos, Experiencia, Contacto, Proyectos, Footer } from '..';
import { useAuthStore, usePortfolioStore } from '../../hooks';
import { MODULOS_CONFIG } from '../../config/modulos';

export const PortfolioPage = () => {

  const { estado } = useAuthStore();
  const { edicion } = usePortfolioStore();

  return (
    <>
      {estado === 'logeado' ? <AdminNavbar/> : ''}
      <Navbar config={MODULOS_CONFIG.navbar} modulosConfig={MODULOS_CONFIG} editar={edicion}/>
      <Perfil config={MODULOS_CONFIG.perfil} editar={edicion}/>
      <Conocimientos config={MODULOS_CONFIG.conocimientos} editar={edicion}/>
      <Experiencia config={MODULOS_CONFIG.experiencia} editar={edicion}/>
      <Proyectos config={MODULOS_CONFIG.proyectos} editar={edicion}/>
      <Contacto config={MODULOS_CONFIG.contacto} editar={edicion}/>
      <Footer/>
    </>
  )
}
