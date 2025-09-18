import { Route, Routes, Navigate} from 'react-router-dom';
import { PortfolioPage } from '../portfolio';
import { LoginPage } from '../auth';
import { useAuthStore } from '../hooks';

export const AppRouter = () => {

    const  {estado} = useAuthStore();

    return (           
        <Routes>
            {
                (estado == 'logeado')
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
                    </>
                )
            }                        
        </Routes>
    );
};
