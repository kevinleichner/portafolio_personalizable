import { createSlice } from '@reduxjs/toolkit';

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    cargando: true,
    edicion: false,
    hayCambios: false,
    mensajeError: undefined,
    modulosActivos: {},
    modulosOrden: [],
    configLocal: {},
  },
  reducers: {
    cargarRepositorio: (state, {payload}) =>{
      state.modulosActivos = payload.modulosActivos;
      state.modulosOrden = payload.modulosOrden;
      state.configLocal = payload.configLocal;
    },
    habilitarEdicion: (state) => {
      state.edicion = true;
      state.mensajeError = undefined;
    },
    deshabilitarEdicion: (state) => {
      state.edicion = false;
      state.mensajeError = undefined;
    },
    activarModulo: (state, { payload }) => {
      state.modulosActivos[payload] = true;

      if (!state.modulosOrden.includes(payload)) {
        const nuevoOrden = state.modulosOrden.length + 1;
        state.configLocal[payload].activo = true;
        state.configLocal[payload].orden = nuevoOrden;

        state.modulosOrden.push(payload);
      }

      state.hayCambios = true;
      state.mensajeError = undefined;
    },
    desactivarModulo: (state, { payload }) => {
      state.modulosActivos[payload] = false;
      state.configLocal[payload].activo = false;

      state.modulosOrden = state.modulosOrden.filter(m => m !== payload);

      state.modulosOrden.forEach((mod, index) => {
        state.configLocal[mod].orden = index + 1;
      });

      state.hayCambios = true;
      state.mensajeError = undefined;
    },
    actualizarConfig: (state, {payload}) => {     
      if (payload.propiedad != null) {
        if (state.configLocal[payload.key][payload.propiedad] !== payload.valor) {
          state.configLocal[payload.key][payload.propiedad] = payload.valor;
          state.hayCambios = true;
          state.mensajeError = undefined;
        }
      } else {
        if (state.configLocal[payload.key] !== payload.valor) {
          state.configLocal[payload.key] = payload.valor;
          state.hayCambios = true;
          state.mensajeError = undefined;
        }
      }
    },
    guardarCambios: (state) => {
      state.hayCambios = false;
      state.mensajeError = undefined;
    },
    reportarError: (state, {payload}) => {
      state.mensajeError = payload;
    },
    limpiarMensajeErrorPortafolio: (state) => {
      state.mensajeError = undefined;
    },
    desactivarCargando: (state) => {
      state.cargando = false;
    },
  },
});

export const { 
  cargarRepositorio, 
  habilitarEdicion, 
  deshabilitarEdicion, 
  reportarError, 
  limpiarMensajeErrorPortafolio, 
  activarModulo, 
  desactivarModulo, 
  actualizarConfig, 
  guardarCambios, 
  desactivarCargando 
} = portfolioSlice.actions;