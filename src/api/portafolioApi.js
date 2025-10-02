import axios from 'axios';
import { getVariablesEntorno } from '../helpers/getVariablesEntorno';

const { VITE_API_URL } = getVariablesEntorno();

const portafolioApi = axios.create({
    baseURL: VITE_API_URL   
});

//TODO: configurar interceptores

export default portafolioApi;
