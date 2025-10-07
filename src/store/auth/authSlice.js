import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        estado: 'cargando',//'pendiente', 'logeado', 'deslogeado', 'cargando'   
        usuario: {},
        mensajeError: undefined,
        mensajeExitoso: undefined,

    },
    reducers: {
        comprobar: (state) => {
            state.estado = 'pendiente';
            state.usuario = {};
            state.mensajeError = undefined;
        },
        cargar: (state) => {
            state.estado = 'cargando';
            state.usuario = {};
            state.mensajeError = undefined;
        },
        logear: (state, {payload}) => {
            state.estado = 'logeado';
            state.usuario = payload;
            state.mensajeError = undefined;
        },
        deslogear: (state, { payload }) => {
            state.estado = 'deslogeado';
            state.usuario = {};
            state.mensajeError = payload;
        },
        registrar: (state, { payload }) => {
            state.estado = 'deslogeado';
            state.usuario = {};
            state.mensajeError = undefined;
            state.mensajeExitoso = payload;
        },
        restablecer: (state, { payload }) => {
            state.estado = 'deslogeado';
            state.usuario = {};
            state.mensajeError = undefined;
            state.mensajeExitoso = payload;
        },
        limpiarMensajeErrorAuth: ( state ) => {
            state.mensajeError = undefined;
        },
        limpiarMensajeExitosoAuth: ( state ) => {
            state.mensajeExitoso = undefined;
        }
    }
});

export const { 
    comprobar, 
    cargar,
    logear, 
    deslogear, 
    restablecer, 
    registrar, 
    limpiarMensajeErrorAuth, 
    limpiarMensajeExitosoAuth } = authSlice.actions;