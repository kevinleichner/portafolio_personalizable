import { MODULOS_CONFIG } from '../config/modulos';

const MODULOS_PERMITIDOS = ['conocimientos', 'experiencia', 'proyectos', 'contacto'];

const configuracionInicial = (config) => {
  const activos = {};
  Object.entries(config).forEach(([key, mod]) => {
    if (MODULOS_PERMITIDOS.includes(key)) activos[key] = !!mod.activo;
  });

  const orden = Object.entries(config)
    .filter(([key]) => activos[key])
    .sort((a, b) => (a[1].orden ?? 0) - (b[1].orden ?? 0))
    .map(([key]) => key);

  return { modulosActivos: activos, modulosOrden: orden };
};

export const preloadedPortfolio = {
  ...configuracionInicial(MODULOS_CONFIG),
};
