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

  useEffect(() => {
    const activos = {};
    Object.entries(MODULOS_CONFIG).forEach(([key, mod]) => {
      if (['conocimientos', 'experiencia', 'proyectos', 'contacto'].includes(key)) {
        activos[key] = mod.activo === true;
      }
    });

    const ordenBase = Object.entries(MODULOS_CONFIG)
      .filter(([key]) => activos[key])
      .sort((a, b) => (a[1].orden ?? 0) - (b[1].orden ?? 0))
      .map(([key]) => key);

    Object.entries(activos).forEach(([key, activo]) => {
      if (activo) dispatch(activarModulo(key));
    });

    dispatch(actualizarOrden(ordenBase));
  }, [dispatch]);

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
