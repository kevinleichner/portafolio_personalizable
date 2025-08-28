import { useDispatch, useSelector } from 'react-redux';
import {
  habilitarEdicion,
  deshabilitarEdicion,
  activarModulo,
  desactivarModulo,
  actualizarOrden,
  actualizarConfigLocal,
} from '../store';

export const usePortfolioStore = () => {
  const dispatch = useDispatch();
  const { edicion, hayCambios, mensajeError, modulosOrden, modulosActivos, configLocal } = useSelector(state => state.portfolio);

  return {
    edicion,
    hayCambios,
    mensajeError,
    modulosOrden,
    modulosActivos,
    configLocal,

    empezarEdicion: () => dispatch(habilitarEdicion()),
    terminarEdicion: () => dispatch(deshabilitarEdicion()),

    activarModuloPorKey: (key) => dispatch(activarModulo(key)),
    desactivarModuloPorKey: (key) => dispatch(desactivarModulo(key)),
    cambiarOrden: (nuevoOrden) => dispatch(actualizarOrden(nuevoOrden)),
    actualizarConfigLocal: (nuevaConfigLocal) => dispatch(actualizarConfigLocal(nuevaConfigLocal)),
  };
};
