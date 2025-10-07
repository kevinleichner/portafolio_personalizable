import { Route, Routes, Navigate } from 'react-router-dom';
import { PortfolioPage } from '../portfolio';
import { LoginPage } from '../auth';
import { useAuthStore } from '../hooks';
import { useEffect } from 'react';

export const AppRouter = () => {

    const { estado, usuario, validarToken } = useAuthStore();

    useEffect(() => {
        validarToken();
    }, [])

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

                    {/* Ruta para ver portafolio deslogeado*/}
                    <Route path="/:urlUsuario" element={<PortfolioPage />} />

                    {/* Cualquier otra ruta que no exista redirige a login */}
                    <Route path="/*" element={<Navigate to="/login" />} />
                </>
            )}
        </Routes>
    );
};
