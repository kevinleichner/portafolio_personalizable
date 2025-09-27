import { MODULOS_CONFIG } from '../config/modulos';
import { CONFIG_GENERAL } from '../config/general';

const MODULOS_PERMITIDOS = ['conocimientos', 'experiencia', 'proyectos', 'contacto'];

const configuracionModulosInicial = (config) => {
  const activos = {};
  Object.entries(config).forEach(([key, mod]) => {
    if (MODULOS_PERMITIDOS.includes(key)) activos[key] = !!mod.activo;
  });

  const orden = Object.entries(config)
    .filter(([key]) => activos[key])
    .sort((a, b) => (a[1].orden ?? 0) - (b[1].orden ?? 0))
    .map(([key]) => key);

  return { modulosActivos: activos, modulosOrden: orden, configLocal: config };
};

const configuracionGeneralInicial = (config) => {
  return { configGeneralLocal: config };
};

export const portafolioPrecargado = {
  ...configuracionModulosInicial(MODULOS_CONFIG),
  ...configuracionGeneralInicial(CONFIG_GENERAL)
};

