import { Route, Routes} from 'react-router-dom';
import { PortfolioPage } from '../portfolio';
import { LoginPage } from '../auth';

export const AppRouter = () => {
    return (           
        <Routes>
            <Route path="/" element={<PortfolioPage/>} />
            <Route path="/login" element={<LoginPage/>} />
        </Routes>
    );
};
