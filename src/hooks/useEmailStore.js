import { useDispatch, useSelector } from 'react-redux';
import { setEnviando, setEnviado } from '../store';
import { portafolioApi } from '../api';

export const useEmailStore = () => {
  const dispatch = useDispatch();
  const { enviando, enviado } = useSelector(state => state.email);

  const enviarMail = async ({ nombre, correoEmisor, mensaje, correoReceptor }) => {
    dispatch(setEnviando(true));

    try {
      const resp = await portafolioApi.post('/email/enviar', {
        nombre,
        correoEmisor,
        mensaje,
        correoReceptor
      });

      if (resp.data.ok) {
        dispatch(setEnviado(true));
        return { ok: true, msg: 'Correo enviado con éxito' };
      } else {
        throw new Error(resp.data.msg);
      }

    } catch (error) {
      return { ok: false, msg: error.message };
    } finally {
      dispatch(setEnviando(false));
    }
  };

  return {
    enviando,
    enviado,
    enviarMail,
  };
};
