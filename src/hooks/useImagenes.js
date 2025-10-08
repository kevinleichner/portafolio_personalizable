import { useState } from "react";
import axios from "axios";
import { getVariablesEntorno } from "../helpers/getVariablesEntorno";

export const useImagenes = () => {
  const { VITE_CLOUDINARY_URL } = getVariablesEntorno();
  const [cargandoImagen, setCargandoImagen] = useState(false);

  const subirImagen = async (archivo, preset) => {
    if (!archivo) return;

    setCargandoImagen(true);

    const datos = new FormData();
    datos.append("file", archivo);
    datos.append("upload_preset", preset);

    try {
      const res = await axios.post(VITE_CLOUDINARY_URL, datos);
      return res.data.secure_url;
    } catch (err) {
      return null;
    } finally {
      setCargandoImagen(false);
    }
  };

  return {
    subirImagen,
    cargandoImagen
  };
};
