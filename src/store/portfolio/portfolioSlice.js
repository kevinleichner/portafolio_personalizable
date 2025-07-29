import { createSlice } from '@reduxjs/toolkit';

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    edicion: false,
    hayCambios: false,
    mensajeError: undefined,
    modulosActivos: {},
    modulosOrden: [],
  },
  reducers: {
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
        state.modulosOrden.push(payload);
      }
      state.hayCambios = true;
      state.mensajeError = undefined;
    },
    desactivarModulo: (state, { payload }) => {
      state.modulosActivos[payload] = false;
      state.modulosOrden = state.modulosOrden.filter(m => m !== payload);
      state.hayCambios = true;
      state.mensajeError = undefined;
    },
    actualizarOrden: (state, { payload }) => {
      state.modulosOrden = payload;
      state.hayCambios = true;
      state.mensajeError = undefined;
    },
    limpiarMensajeErrorPortafolio: (state) => {
      state.mensajeError = undefined;
    },
  },
});

export const { habilitarEdicion, deshabilitarEdicion, limpiarMensajeErrorPortafolio, activarModulo, desactivarModulo, actualizarOrden } = portfolioSlice.actions;