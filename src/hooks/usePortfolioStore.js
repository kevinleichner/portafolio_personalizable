import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MODULOS_CONFIG } from '../config/modulos';
import {
  habilitarEdicion,
  deshabilitarEdicion,
  activarModulo,
  desactivarModulo,
  actualizarOrden,
} from '../store';

export const usePortfolioStore = () => {
  const dispatch = useDispatch();
  const { edicion, hayCambios, mensajeError, modulosOrden, modulosActivos } = useSelector(state => state.portfolio);

  return {
    edicion,
    hayCambios,
    mensajeError,
    modulosOrden,
    modulosActivos,

    empezarEdicion: () => dispatch(habilitarEdicion()),
    terminarEdicion: () => dispatch(deshabilitarEdicion()),

    activarModuloPorKey: (key) => dispatch(activarModulo(key)),
    desactivarModuloPorKey: (key) => dispatch(desactivarModulo(key)),
    cambiarOrden: (nuevoOrden) => dispatch(actualizarOrden(nuevoOrden)),
  };
};
