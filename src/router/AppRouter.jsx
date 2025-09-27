import { Route, Routes, Navigate} from 'react-router-dom';
import { PortfolioPage } from '../portfolio';
import { LoginPage } from '../auth';
import { useAuthStore, usePortfolioStore } from '../hooks';

export const AppRouter = () => {

    const  {estado, usuario} = useAuthStore();
    const {configGeneralLocal} = usePortfolioStore();
   
    return (         
        <Routes>
            {
                (estado == 'logeado' && Object.keys(usuario).length !== 0)
                ? (
                    <>
                        <Route path="/" element={<PortfolioPage/>} />
                        <Route path="/*" element={ <Navigate to="/"/> }/>
                    </>
                )
                : (
                    <>
                        <Route path="/login/*" element={<LoginPage/>} />
                        <Route path="/*" element={ <Navigate to="/login"/> }/>
                        {/* CAMBIAR ESTO POR LA BASE DE DATOS */}
                        <Route path={`/${configGeneralLocal.urlUsuario}`} element={<PortfolioPage/>} /> 
                    </>
                )
            }                        
        </Routes>
    );
};
