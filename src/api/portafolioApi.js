import axios from 'axios';
import { getVariablesEntorno } from '../helpers/getVariablesEntorno';

const { VITE_API_URL } = getVariablesEntorno();

const portafolioApi = axios.create({
    baseURL: VITE_API_URL   
});

//interceptor
portafolioApi.interceptors.request.use( config => {
    config.headers = {
        ...config.headers,
        //en la peticion mandamos como header 'x-token' con el valor del token de jwt
        'x-token': localStorage.getItem('token')
    }

    return config;
})


export default portafolioApi;
