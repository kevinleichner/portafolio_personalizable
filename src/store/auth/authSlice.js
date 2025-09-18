import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        estado: 'deslogeado',//'pendiente', //'logeado', 'deslogeado'
        usuario: {},
        mensajeError: undefined,

    },
    reducers: {
        Comprobar: (state) => {
            state.estado = 'pendiente';
            state.usuario = {};
            state.mensajeError = undefined;
        },
        Logear: (state, {payload}) => {
            state.estado = 'logeado';
            state.usuario = payload;
            state.mensajeError = undefined;
        },
        Deslogear: (state, { payload }) => {
            state.estado = 'deslogeado';
            state.usuario = {};
            state.mensajeError = payload;
        },
        limpiarMensajeErrorAuth: ( state ) => {
            state.mensajeError = undefined;
        }
    }
});

export const { Comprobar, Logear, Deslogear, limpiarMensajeErrorAuth } = authSlice.actions;