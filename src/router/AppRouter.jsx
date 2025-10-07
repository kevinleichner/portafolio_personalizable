import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { PortfolioPage } from '../portfolio';
import { LoginPage } from '../auth';
import { useAuthStore } from '../hooks';
import { useEffect } from 'react';

export const AppRouter = () => {

    const { estado, usuario, validarToken, estadoDeslogeado } = useAuthStore();
    const location = useLocation();

    const esRutaPortafolioPublico = 
        location.pathname !== '/' &&
        !location.pathname.startsWith('/login') &&
        location.pathname.split('/').length === 2;

    useEffect(() => {
        if (estado === 'cargando') {
            validarToken(esRutaPortafolioPublico);
        }
    }, []);

    if (estado == 'cargando') {
        return (     
            <div className='flex items-center justify-center h-[100vh] bg-[#7eb77f]'>
            <h3 className='text-2xl text-white md:text-4xl'>
                Cargando...
            </h3>
            </div>
        )
    }

    return (
        <Routes>
            {estado === 'logeado' && Object.keys(usuario).length !== 0 ? (              
                <>
                    {/* Portafolio del usuario logueado */}
                    <Route path="/" element={<PortfolioPage />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </>
            ) : (
                <>
                    {/* Login */}
                    <Route path="/login/*" element={<LoginPage />} />

                    {/* Ruta para ver portafolio público*/}
                    <Route path="/:urlUsuario" element={<PortfolioPage />} />

                    {/* Cualquier otra ruta que no exista redirige a login */}
                    <Route path="/*" element={<Navigate to="/login" />} />
                </>
            )}
        </Routes>
    );
};
