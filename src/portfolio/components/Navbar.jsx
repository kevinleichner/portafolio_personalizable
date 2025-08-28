import { SelectorColor } from "./SelectorColor";
import { useSelectorColor } from '../../hooks';

export const Navbar = ({config, modulosConfig, modulosOrden, editar}) => {

  const componente = 'navbar';

  const {
      mostrarSelectorColor,
      posicionSelectorColor,
      colorInicial,
      botonColorRef,
      abrirSelectorColor,
      cerrarSelectorColor,
      manejarCambioColor,
    } = useSelectorColor();

  const modulos = modulosOrden
  .map((key) => {
    const mod = modulosConfig[key];
    if (!mod || !mod.titulo) return null; // Ignorar si no existe o sin título
    return { id: mod.id, titulo: mod.titulo };
  })
  .filter(Boolean); // Para evitar objetos con título undefined

  return (
    <nav className={`${editar == true ? 'pt-13' : ''} flex justify-center flex-col text-center relative
                    font-semibold uppercase text-lg
                    py-4 gap-2 
                    sm:py-8 bg-[${config.colorFondo}]
                    sm:text-sm sm:flex-row sm:text-left sm:text-lg sm:gap-5
                    md:gap-10 
                    lg:gap-20`}>    

      {modulos.map((m, indice, list) => (
        <div key={indice} className="sm:inline-flex flex items-center justify-center gap-2">
          <a className={`text-sm text-[${config.colorTexto}]
                        hover:underline hover:underline-offset-8 hover:decoration-4
                        lg:text-md`}                        
              href={`#${m.id}`}>
            {m.titulo}
          </a>
          {editar && indice === list.length - 1 &&(
            <button 
              onClick={(e) =>
                abrirSelectorColor(e, config.colorTexto, (nuevoColor) => {
                  setConfigLocal({ ...config, colorTexto: nuevoColor });
                }, {
                  vertical: "abajo",
                  horizontal: "izquierda"
                })
              }
              className="flex items-center justify-center cursor-pointer
                        bg-white p-1 rounded-full
                        hover:bg-pink-400">
              <i className="fa-solid fa-palette text-sm"/>
            </button>
          )}
        </div>    
      ))}
      
      {editar === true && (
        <button 
          onClick={(e) =>
                      abrirSelectorColor(e, config.colorFondo, (nuevoColor) => {
                        setConfigLocal({ ...config, colorFondo: nuevoColor });
                      }, {
                        vertical: "abajo",
                        horizontal: "izquierda"
                      })
                    }
          className={`absolute right-2 top-3 cursor-pointer flex items-center
                              bg-white rounded-full p-2 
                              hover:bg-pink-400
                              xl:right-10`}>
              <i className="fa-solid fa-paint-roller text-sm
                            xl:text-xl"/>
        </button>
      )}

      {mostrarSelectorColor && editar && (
          <SelectorColor
            colorInicial={colorInicial}
            manejarCambioColor={manejarCambioColor}
            top={posicionSelectorColor.top}
            left={posicionSelectorColor.left}
            manejarClickAfuera={cerrarSelectorColor}
            botonColorRef={botonColorRef.current}
          />
        )}
            
    </nav>
  )
}
