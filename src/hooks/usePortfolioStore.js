import { useDispatch, useSelector } from 'react-redux';
import {
  habilitarEdicion,
  deshabilitarEdicion,
  activarModulo,
  desactivarModulo,
  actualizarOrden,
  actualizarConfigLocal,
  actualizarConfigGeneralLocal,
  guardarCambios,
} from '../store';

export const usePortfolioStore = () => {
  const dispatch = useDispatch();
  const { edicion, hayCambios, mensajeError, modulosOrden, modulosActivos, configLocal, configGeneralLocal } = useSelector(state => state.portfolio);

  return {
    edicion,
    hayCambios,
    mensajeError,
    modulosOrden,
    modulosActivos,
    configLocal,
    configGeneralLocal,

    empezarEdicion: () => dispatch(habilitarEdicion()),
    terminarEdicion: () => dispatch(deshabilitarEdicion()),

    activarModuloPorKey: (key) => dispatch(activarModulo(key)),
    desactivarModuloPorKey: (key) => dispatch(desactivarModulo(key)),
    cambiarOrden: (nuevoOrden) => dispatch(actualizarOrden(nuevoOrden)),
    actualizarConfigLocal: (nuevaConfigLocal) => dispatch(actualizarConfigLocal(nuevaConfigLocal)),
    actualizarConfigGeneralLocal: (nuevaConfigGeneralLocal) => dispatch(actualizarConfigGeneralLocal(nuevaConfigGeneralLocal)),
    guardarCambios: (cambios) => dispatch(guardarCambios(cambios)),
  };
};
