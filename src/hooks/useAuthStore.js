import { useDispatch, useSelector } from 'react-redux';
import { limpiarMensajeErrorAuth, Comprobar, Logear, Deslogear } from '../store';

export const useAuthStore = () => {
  const { estado, usuario, mensajeError } = useSelector ( state => state.auth );
  const dispatch = useDispatch();

  const empezarLogeo = async({ email, clave }) => {
    dispatch( Comprobar() );

    try {
        
        //const {data} = await calendarApi.post('/auth',{email, clave});
        //localStorage.setItem('token', data.token);
        //localStorage.setItem('token-init-date', new Date().getTime() );
        dispatch( Logear({nombre: 'Kevin', uid: '1234567'}) );

    } catch (error) {
        dispatch( Deslogear('Credenciales incorrectas.'));
        setTimeout(() => {
            dispatch( limpiarMensajeErrorAuth() );
        }, 10);
    }
  }

  const empezarRegistro = async({ nombre, email, clave }) => {
    dispatch( onChecking() );

    try {
        
        // const {data} = await calendarApi.post('/auth/new',{nombre, email, clave});
        // localStorage.setItem('token', data.token);
        // localStorage.setItem('token-init-date', new Date().getTime() );
        dispatch( Logear({nombre: 'Kevin', uid: '123456'}) );

    } catch (error) {
        //dispatch( Deslogear(error.response.data?.msg || Object.values(error.response.data.errors)[0].msg)); //Lo primero es los errores que manda el res.status(400).json y lo segundo es lo que manda el express-validator
        dispatch( Deslogear('Error al registrar: ' + error));
        setTimeout(() => {
            dispatch( limpiarMensajeErrorAuth() );
        }, 10);
    }
  }

  // const checkAuthToken = async() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) return dispatch( onLogout() );
  //   try {
  //       const  { data } = await calendarApi.get('auth/renew')
  //       localStorage.setItem('token', data.token);
  //       localStorage.setItem('token-init-date', new Date().getTime() );
  //       dispatch( onLogin({name: data.name, uid: data.uid}) );
  //   } catch (error) {
  //       localStorage.clear();
  //       dispatch( onLogout() );
  //   }
  // }

  const empezarDeslogeo = () => {
    localStorage.clear();
    // dispatch( onLogoutCalendar() );
    dispatch(Deslogear());
  }

  return {
    //*Propiedades
    mensajeError,
    estado,
    usuario,

    //*Métodos
    empezarLogeo,
    empezarRegistro,
    // checkAuthToken,
    empezarDeslogeo
  }
}
