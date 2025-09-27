export const getVariablesEntorno = () => {

    import.meta.env;

    return {
        ...import.meta.env
    }

};