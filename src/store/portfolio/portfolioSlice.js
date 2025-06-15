import { createSlice } from '@reduxjs/toolkit';

export const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState: {
        edicion: false,
        modulos: [],
        hayCambios: false,
        mensajeError: undefined,
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
        habilitarHayCambios: (state) => {
            state.hayCambios = true;
            state.mensajeError = undefined;
        },
        agregarModulo: (state, {payload}) => {
            state.modulos.push(payload);
            state.hayCambios = true;
            state.mensajeError = undefined;
        },
        actualizarModulos: (state, { payload }) => {
            state.modulos = state.modulos.map(modulo => {
              const actualizado = payload.find(m => m.id === modulo.id);
              return actualizado ? actualizado : modulo;
            });
            state.hayCambios = false;
        },
        eliminarModulo: (state, {payload}) => {
            state.modulos = state.modulos.filter(modulo => modulo.id !== payload.id);
            state.hayCambios = true;
            state.mensajeError = undefined;
        },
        limpiarMensajeErrorPortafolio: ( state ) => {
            state.mensajeError = undefined;
        }
    }
});

export const { habilitarEdicion, deshabilitarEdicion, habilitarHayCambios, agregarModulo, actualizarModulos, eliminarModulo, limpiarMensajeErrorPortafolio } = portfolioSlice.actions;