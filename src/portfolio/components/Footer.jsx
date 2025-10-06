import { getVariablesEntorno } from "../../helpers/getVariablesEntorno"

export const Footer = () => {

  const {VITE_URL_BASE} = getVariablesEntorno();

  return (
    <div className="p-10 text-white bg-[#081c15] text-center">
        <p>
          ¿Querés tener un portafolio como este? Ingresa{" "}
          <a href={VITE_URL_BASE} target="_blank" className="text-pink-500 hover:underline hover:underline-offset-6 hover:decoration-2">
            aquí
          </a>
        </p>
    </div>
  )
}
