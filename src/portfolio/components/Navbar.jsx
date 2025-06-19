
import {useState, useEffect} from "react";
import { SelectorColor } from "./SelectorColor";
import { useSelectorColor } from '../../hooks';

export const Navbar = ({config, modulosConfig, editar}) => {

  const {
      mostrarSelectorColor,
      posicionSelectorColor,
      colorInicial,
      botonRef,
      abrirSelectorColor,
      cerrarSelectorColor,
      manejarCambioColor,
    } = useSelectorColor();

  const [configLocal, setConfigLocal] = useState(config);

  useEffect(() => {
    setConfigLocal(config);
  }, [config]);

  const modulos = Object.entries(modulosConfig)
  .filter(([key]) => key !== "perfil") // Ignorar el modulo perfil
  .map(([_, value]) => ({
    id: value.id,
    titulo: value.titulo,
  }))
  .filter(modulo => modulo.titulo); // Para evitar objetos con título undefined

  return (
    <nav className={`${editar == true ? 'pt-13' : ''} flex justify-center flex-col text-center relative
                    font-semibold uppercase text-lg
                    py-4 gap-2 
                    sm:py-8 bg-[${configLocal.colorFondo}]
                    sm:text-sm sm:flex-row sm:text-left sm:text-lg sm:gap-5
                    md:gap-10 
                    lg:gap-20`}>    

      {modulos.map((m, indice, list) => (
        <div key={indice} className="sm:inline-flex flex items-center justify-center gap-2">
          <a className={`text-sm text-[${configLocal.colorTexto}]
                        hover:underline hover:underline-offset-8 hover:decoration-4
                        lg:text-md`}                        
              href={`#${m.id}`}>
            {m.titulo}
          </a>
          {editar && indice === list.length - 1 &&(
            <button 
              onClick={(e) =>
                abrirSelectorColor(e, configLocal.colorTexto, (nuevoColor) => {
                  setConfigLocal({ ...configLocal, colorTexto: nuevoColor });
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
                      abrirSelectorColor(e, configLocal.colorFondo, (nuevoColor) => {
                        setConfigLocal({ ...configLocal, colorFondo: nuevoColor });
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
            onChange={manejarCambioColor}
            top={posicionSelectorColor.top}
            left={posicionSelectorColor.left}
            onClickFuera={cerrarSelectorColor}
            botonRef={botonRef.current}
          />
        )}
            
    </nav>
  )
}
