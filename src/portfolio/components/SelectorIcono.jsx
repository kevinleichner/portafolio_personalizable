// src/portfolio/components/SelectorIcono.jsx
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export const SelectorIcono = ({ manejarSeleccionIcono }) => {
  const [valorInput, setValorInput] = useState("");
  const [iconoBusqueda, setIconoBusqueda] = useState("facebook");
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    if (iconoBusqueda.length < 2) {
      setResultados([]);
      return;
    }

    const buscarIconos = async () => {
      try {
        const respuesta = await fetch(
          `https://api.iconify.design/search?query=${encodeURIComponent(
            iconoBusqueda
          )}&limit=20`
        );
        const datos = await respuesta.json();
        if (datos && datos.icons) {
          setResultados(datos.icons);
        } else {
          setResultados([]);
        }
      } catch (error) {
        setResultados([]);
      }
    };

    buscarIconos();
  }, [iconoBusqueda]);

  const manejarCambioValorInput = (e) => {
    const nuevoValor = e.target.value;
    setValorInput(nuevoValor);
    setIconoBusqueda(nuevoValor);
  };

  return (
    <div
      className="bg-white border border-gray-300 rounded shadow-lg p-2 w-50 h-50 text-sm overflow-y-auto"
      style={{ zIndex: 1000 }}
    >
      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          placeholder="Buscar ícono..."
          value={valorInput}
          onChange={manejarCambioValorInput}
          className="w-full p-1 border border-gray-300 outline-none rounded"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {resultados.map((icono) => (
          <button
            key={icono}
            onClick={() => manejarSeleccionIcono(icono)}
            className="p-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-200"
          >
            <Icon icon={icono} width="24" height="24" />
          </button>
        ))}
      </div>
    </div>
  );
};
