import { useEffect, useMemo, useState } from 'react';

export const useForm = ( formularioInicial = {}, validacionesFormulario = {}) => {
  
    const [ estadoFormulario, setEstadoFormulario ] = useState( formularioInicial );
    const [ validacionFormulario, setValidacionFormulario ] = useState({});

    useEffect(() => {
        crearValidadores();
    }, [ estadoFormulario ])

    useEffect(() => {
        setEstadoFormulario( formularioInicial );
    }, [ formularioInicial ])
    
    
    const formularioValido = useMemo( () => {

        for (const valorFormulario of Object.keys( validacionFormulario )) { //Esto lo que hace es recorrer todas las propiedades de formValidation, guarda la primera en formValue, ejecuta el código y pasa a la segunda...
            if ( validacionFormulario[valorFormulario] !== null ) return false;
        }

        return true;
    }, [ validacionFormulario ])


    const cambiarInput = ({ target }) => {
        const { name, value } = target;
        setEstadoFormulario({
            ...estadoFormulario,
            [ name ]: value
        });
    }

    const resetearFormulario = () => {
        setEstadoFormulario( formularioInicial );
    }

    const crearValidadores = () => {
        
        const valoresChequeados = {};
        
        for (const campo of Object.keys( validacionesFormulario )) {
            const [ funcion, mensajeError ] = validacionesFormulario[campo];

            valoresChequeados[`${ campo }Valid`] = funcion( estadoFormulario[campo] ) ? null : mensajeError;
        }

        setValidacionFormulario( valoresChequeados );
    }



    return {
        ...estadoFormulario,
        estadoFormulario,
        cambiarInput,
        resetearFormulario,

        ...validacionFormulario,
        formularioValido
    }
}