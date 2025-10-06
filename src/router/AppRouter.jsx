import { Route, Routes, Navigate } from 'react-router-dom';
import { PortfolioPage } from '../portfolio';
import { LoginPage } from '../auth';
import { useAuthStore } from '../hooks';

export const AppRouter = () => {

    const { estado, usuario } = useAuthStore();

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
