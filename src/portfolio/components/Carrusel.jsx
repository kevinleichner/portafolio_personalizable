import { useRef, useState } from 'react';

export const Carrusel = ({ imagenes, colorFondo, editar = false, eliminarImagenCarrusel, cambiarImagenCarrusel, agregarImagenCarrusel, cargandoImgIndice }) => {
  const scrollRef = useRef(null);
  const [imagenActual, setImagenActual] = useState(0);

  const scrollImagen = (index) => {
    const contenedor = scrollRef.current;
    const img = contenedor.children[index];
    if (img) {
      contenedor.scrollTo({
        left: img.offsetLeft - contenedor.offsetWidth / 2 + img.offsetWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  const siguiente = () => {
    const total = editar ? imagenes.length + 1 : imagenes.length;
    const siguienteImagen = (imagenActual + 1) % total;
    setImagenActual(siguienteImagen);
    scrollImagen(siguienteImagen);
  };

  const anterior = () => {
    const total = editar ? imagenes.length + 1 : imagenes.length;
    const anteriorImagen = (imagenActual - 1 + total) % total;
    setImagenActual(anteriorImagen);
    scrollImagen(anteriorImagen);
  };

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className={`overflow-x-auto flex gap-2 sm:gap-4 snap-x snap-mandatory scroll-smooth hide-scrollbar 
                    pt-6 pb-3 rounded-t-sm h-auto
                    bg-[${colorFondo}]`}
      >
        {imagenes.map((img, i) => (
          <div 
            key={i}
            className={`relative snap-center flex-shrink-0
                      ${i === 0 ? 'ml-[20%]' : i === imagenes.length - 1 && !editar ? 'mr-[20%]' : ''}`}
          >
            {cargandoImgIndice === i && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20">
                <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={img.url}
              alt={`img-${i}`}
              className="object-cover h-30 md:h-70 max-w-[590px] rounded-sm"
            />

            {editar && (
              <>
                <button
                  title='Cambiar imagen'
                  onClick={() => document.getElementById(`imgCarrusel-${i}`).click()}
                  className="absolute flex item-center justify-center top-1 right-7 bg-white p-1 rounded-full cursor-pointer hover:bg-pink-400"
                >
                  <i className="fa-solid fa-image text-sm" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  id={`imgCarrusel-${i}`}
                  className="hidden"
                  onChange={(e) => cambiarImagenCarrusel(e, i)}
                />

                <button
                  title='Eliminar imagen'
                  onClick={() => eliminarImagenCarrusel(i)}
                  className="absolute flex item-center  justify-center top-1 right-1 bg-white p-1 rounded-full cursor-pointer hover:bg-red-500"
                >
                  <i className="fa-solid fa-trash text-sm" />
                </button>
              </>
            )}
          </div>
        ))}

        {editar && (
          <div className="relative snap-center flex-shrink-0 mr-[10%]">
            <button
              title='Agregar imagen'
              onClick={agregarImagenCarrusel}
              className="h-30 md:h-70 w-35 bg-white rounded-sm flex items-center justify-center cursor-pointer hover:bg-gray-200 border-2 border-dashed border-gray-400"
            >
              <i className="fa-solid fa-plus text-3xl text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <button
        title='Anterior imagen'
        onClick={anterior}
        className="absolute cursor-pointer 
                  bg-white 
                  p-2 top-1/2 left-2 transform -translate-y-1/2 rounded-sm  
                  hover:bg-pink-400"
      >
        <i className="fa-solid fa-arrow-left" />
      </button>
      
      <button
        title='Siguiente imagen'
        onClick={siguiente}
        className="absolute cursor-pointer
                  bg-white
                  top-1/2 right-2 transform -translate-y-1/2 p-2 rounded-sm 
                  hover:bg-pink-400"
      >
        <i className="fa-solid fa-arrow-right" />
      </button>
    </div>
  );
};
