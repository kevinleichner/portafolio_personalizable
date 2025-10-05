import { createSlice } from '@reduxjs/toolkit';

export const emailSlice = createSlice({
  name: 'email',
  initialState: {
    enviando: false,
    enviado: false,
  },
  reducers: {
    setEnviando: (state, {payload}) => { 
        state.enviando = payload;
    },
    setEnviado: (state, {payload}) => {
        state.enviado = payload 
    }
  }
});

export const { setEnviando, setEnviado } = emailSlice.actions;
