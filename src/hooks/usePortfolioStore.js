import { useDispatch, useSelector } from 'react-redux';
import { habilitarEdicion, deshabilitarEdicion, habilitarHayCambios, agregarModulo, actualizarModulos, eliminarModulo, limpiarMensajeErrorPortafolio } from '../store';

export const usePortfolioStore = () => {

    const { edicion, modulos, hayCambios, mensajeError } = useSelector ( state => state.portfolio );
    const dispatch = useDispatch();

    const empezarEdicion = () => {
        dispatch(habilitarEdicion());
    }

    const terminarEdicion = () => {
      dispatch(deshabilitarEdicion());
    }

    const guardarCambios = () => {
        dispatch(actualizarModulos());
    }

  return {
    edicion,
    modulos,
    hayCambios,
    mensajeError,

    empezarEdicion,
    terminarEdicion
  }
}
