import { useDispatch, useSelector } from 'react-redux';
import { limpiarMensajeErrorAuth, limpiarMensajeExitosoAuth, comprobar, cargar, logear, deslogear, registrar, restablecer } from '../store';
import { portafolioApi } from '../api';

export const useAuthStore = () => {
  const { estado, usuario, mensajeError, mensajeExitoso } = useSelector ( state => state.auth );
  const dispatch = useDispatch();

  const empezarLogeo = async({ usuario, clave }) => {
    dispatch( comprobar() );

    try {
        const {data} = await portafolioApi.post('/auth/iniciar',{usuario, clave});
        localStorage.setItem('token', data.token);
        localStorage.setItem('token-init-date', new Date().getTime() );
        dispatch( logear({usuario: data.usuario, uid: data.uid}) )

    } catch (error) {
        dispatch( deslogear('Credenciales incorrectas.'));
        setTimeout(() => {
            dispatch( limpiarMensajeErrorAuth() );
        }, 10);
    }
  }

  const empezarRegistro = async({ usuario, codigo, clave }) => {
    dispatch( comprobar() );

    try {
        
        const {data} = await portafolioApi.post('/auth/crear',{usuario, clave, codigoSeguridad:codigo});
        dispatch( registrar(data?.msg) );
        setTimeout(() => {
            dispatch( limpiarMensajeExitosoAuth() );
        }, 10);

    } catch (error) {
        dispatch( deslogear(error.response.data?.msg || Object.values(error.response.data.errores)[0].msg));   
        setTimeout(() => {
            dispatch( limpiarMensajeErrorAuth() );
        }, 10);
    }
  }

  const empezarRecuperacion = async({usuario, codigo, nuevaClave}) => {
    try {
        
        const {data} = await portafolioApi.put('/auth/restablecer',{usuario, nuevaClave, codigoSeguridad:codigo});
        dispatch( restablecer(data?.msg) );
        setTimeout(() => {
            dispatch( limpiarMensajeExitosoAuth() );
        }, 10);

    } catch (error) {
        dispatch( deslogear(error.response.data?.msg || Object.values(error.response.data.errores)[0].msg));
        setTimeout(() => {
            dispatch( limpiarMensajeErrorAuth() );
        }, 10);
    }
  }

  const validarToken = async (forzarDeslogueo = false) => {
    if (forzarDeslogueo) {
      dispatch(deslogear());
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return dispatch(deslogear());

    try {
      const { data } = await portafolioApi.get('auth/revalidar');
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());
      dispatch(logear({ usuario: data.usuario, uid: data.uid }));
    } catch (error) {
      localStorage.clear();
      dispatch(deslogear());
    }
  };

  const empezarDeslogeo = () => {
    localStorage.clear();
    dispatch(deslogear());
  }

  return {
    //*Propiedades
    mensajeError,
    mensajeExitoso,
    estado,
    usuario,


    //*Métodos
    empezarLogeo,
    empezarRegistro,
    empezarRecuperacion,
    empezarDeslogeo,
    validarToken, 
  }
}
