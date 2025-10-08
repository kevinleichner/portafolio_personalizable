import { usePortfolioStore } from "../../hooks";

export const AgregarModulo = ({ config }) => {
  const { modulosActivos, activarModuloPorKey } = usePortfolioStore();

  const modulosDisponibles = Object.entries(config)
    .filter(([key]) =>
      ['conocimientos', 'experiencia', 'proyectos', 'contacto'].includes(key) &&
      !modulosActivos[key]
    );

  return (
    <div className="p-8 bg-gray-600 flex-column text-center font-sans">
      <h2 className="text-white text-4xl font-semibold mb-10 sm:text-5xl">
        Agregar Módulo
      </h2>
      <div className="flex justify-around w-[75%] m-auto flex-wrap gap-6">
        {modulosDisponibles.map(([moduloKey]) => (
          <div
            key={moduloKey}
            className="p-2 border-4 rounded border-gray-200 cursor-pointer hover:bg-blue-600 hover:scale-105 transition-transform"
            onClick={() => activarModuloPorKey(moduloKey)}
          >
            <img
              src={`/img/${moduloKey}.png`}
              width={150}
              alt={`Agregar ${moduloKey}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
