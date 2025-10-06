import { useDispatch, useSelector } from 'react-redux';
import { portafolioApi } from '../api';
import {
  activarNoEncontrada,
  habilitarEdicion,
  deshabilitarEdicion,
  activarModulo,
  desactivarModulo,
  actualizarConfig,
  guardarCambios,
  deshacerCambios,
  cargarRepositorio,
  desactivarCargando,
  reportarError,
  limpiarMensajeErrorPortafolio,
} from '../store';

export const usePortfolioStore = () => {
  const dispatch = useDispatch();
  const { 
    noEncontrada,
    cargando, 
    edicion, 
    hayCambios, 
    mensajeError, 
    modulosOrden, 
    modulosActivos, 
    configLocal,
    configLocalInicial,
  } = useSelector(state => state.portfolio);

  const obtenerRepositorioUsuario = async(uid) => {
      try {
        const { data } = await portafolioApi.get(`/portafolio/obtener/${uid}`);
        const MODULOS_PERMITIDOS = ['conocimientos', 'experiencia', 'proyectos', 'contacto'];

        const config = data.portafolio.config;
       
        const activos = {};
        Object.entries(config).forEach(([key, mod]) => {
          if (MODULOS_PERMITIDOS.includes(key)) activos[key] = !!mod.activo;
        });

        const orden = Object.entries(config)
          .filter(([key]) => activos[key])
          .sort((a, b) => (a[1].orden ?? 0) - (b[1].orden ?? 0))
          .map(([key]) => key);

        dispatch(cargarRepositorio({
          modulosActivos: activos,
          modulosOrden: orden,
          configLocal: config,
        }));

        dispatch(desactivarCargando())

      } catch (error) {
        if (error.response?.status === 404) {
          dispatch( activarNoEncontrada() );
        }
        else {
          dispatch( reportarError("Ocurrió un problema al querer cargar la configuración, recargue la página e intente nuevamente en unos segundos."));
          setTimeout(() => {
            dispatch( limpiarMensajeErrorPortafolio() );
          }, 10);
        }  
      }
  };

  const activarModuloPorKey = (key) => {
    try {
      dispatch(activarModulo(key));
    } catch (error) {
      dispatch( reportarError("Ocurrió un problema al querer activar un módulo, intente nuevamente en unos segundos."));
      setTimeout(() => {
          dispatch( limpiarMensajeErrorPortafolio() );
      }, 10);
    }
  }

  const desactivarModuloPorKey = (key) => {
    try {
      dispatch(desactivarModulo(key));
    } catch (error) {
      dispatch( reportarError("Ocurrió un problema al querer desactivar un módulo, intente nuevamente en unos segundos."));
      setTimeout(() => {
          dispatch( limpiarMensajeErrorPortafolio() );
      }, 10);
    }
  }

  const actualizarConfigLocal = async(nuevaConfigLocal) => {
    try {
      dispatch(actualizarConfig(nuevaConfigLocal))
    } catch (error) {
      dispatch( reportarError("Ocurrió un problema al querer actualizar la configuración, intente nuevamente en unos segundos."));
      setTimeout(() => {
          dispatch( limpiarMensajeErrorPortafolio() );
      }, 10);
    }    
  }

  const empezarDeshacerCambios = () => {     
      try {
        const MODULOS_PERMITIDOS = ['conocimientos', 'experiencia', 'proyectos', 'contacto'];
        const config = configLocalInicial;
       
        const activos = {};
        Object.entries(config).forEach(([key, mod]) => {
          if (MODULOS_PERMITIDOS.includes(key)) activos[key] = !!mod.activo;
        });

        const orden = Object.entries(config)
          .filter(([key]) => activos[key])
          .sort((a, b) => (a[1].orden ?? 0) - (b[1].orden ?? 0))
          .map(([key]) => key);

        dispatch(deshacerCambios({
          modulosActivos: activos,
          modulosOrden: orden,
          configLocal: config,
        }));

        return true;
      } catch (error) {       
        dispatch( reportarError("Ocurrió un problema al querer deshacer los cambios, intente nuevamente en unos segundos."));
        setTimeout(() => {
            dispatch( limpiarMensajeErrorPortafolio() );
        }, 10);
        return false;
      }
  }

  const empezarGuardarCambios = async(uid, nuevaConfigLocal) => {
    try {
      await portafolioApi.put(`/portafolio/guardar/${ uid }`, nuevaConfigLocal)
      dispatch(guardarCambios());
      return true;
    } catch (error) {
      dispatch( reportarError(error.response.data?.msg || Object.values(error.response.data.errores)[0].msg));
      setTimeout(() => {
          dispatch( limpiarMensajeErrorPortafolio() );
      }, 10);
      return false;
    }
  }

  return {
    noEncontrada,
    cargando,
    edicion,
    hayCambios,
    mensajeError,
    modulosOrden,
    modulosActivos,
    configLocal,
    
    obtenerRepositorioUsuario,
    empezarGuardarCambios,
    empezarDeshacerCambios,
    activarModuloPorKey,
    desactivarModuloPorKey,
    actualizarConfigLocal,
    empezarEdicion: () => dispatch(habilitarEdicion()),
    terminarEdicion: () => dispatch(deshabilitarEdicion()),
  };
};
