export const MODULOS_CONFIG = {
    navbar: {
        colorTexto: "#000",
        colorFondo: "#ffff"
    },
    perfil: {
        titulo: "Nombre y apellido",
        colorTitulo: "#000",
        colorFondo: "#b7e4c7",
        colorTexto: "#000",
        colorBorde: "#000",
        anchoBorde: "1",
        descripcion: "Descripción",
        imagen: "../img/perfil.jpg",
        redesSociales : [
            {
                icono: "fa-facebook",              
                url : "facebook.com",
                colorIcono: "#000",
                colorFondo: "#ffff",
                id: 1
            },
            {
                icono: "fa-facebook",              
                url : "facebook.com",
                colorIcono: "#000",
                colorFondo: "#ffff",
                id: 2
            },{
                icono: "fa-facebook",              
                url : "facebook.com",
                colorIcono: "#000",
                colorFondo: "#ffff",
                id: 3
            }
        ]       
    },
    conocimientos: {
        id: "1",
        orden: 1,
        activo: true,
        titulo: "Titulo",
        orientacionTitulo: "center",
        colorTitulo: "#000",
        colorFondo: "#ffff",
        conocimientos: [
            {
                imagen: "../img-conocimientos/css.png",
                texto: "HTML",
                colorFondo: "#ccc",
                colorTexto: "#000"
            }
        ]      
    },
    experiencia: {
        id: "2",
        orden: 2,
        activo: false,
        titulo: "Titulo",
        orientacionTitulo: "center",
        colorTitulo: "#000",
        colorFondo: "#ccc",      
        tarjetas: [
            {
                puesto: "Rol o puesto",
                empresa: "Nombre de empresa",
                tiempo: "Enero 2020 - Febrero 2021",
                descripcion: "Descripcion experiencia",
                colorTexto: "#000",
                colorFondo: "#ffff"
            }
        ]
    },
    proyectos: {
        id: "3",
        activo: false,
        orden: 3,
        titulo: "Titulo",
        orientacionTitulo: "center",
        colorTitulo: "#000",
        colorFondo: "#ccc",               
        proyectos: [
            {
                titulo: "Titulo",
                colorBoton: "#1a5fad",  
                colorTexto: "#000",
                colorFondoEtiqueta: "#1a5fad",           
                imagenFondo: "../img-proyectos/ahorcado.jpg",
                etiquetas: [
                    {
                        texto: "Etiqueta",                                           
                    },
                    {
                        texto: "Etiqueta",                                            
                    },
                    {
                        texto: "Etiqueta",                                                                 
                    }
                    
                ],
                //Ventanita que se abre al presionar "Ver más"
                colorFondoImagenes:"#ccc",
                colorFondoTexto:"#ffff",
                imagenes: [
                    {
                        url: "../img-vista-proyecto/foto5.jpg"
                    },
                    {
                        url: "../img-proyectos/banco.jpg"
                    },
                    {
                        url: "../img-proyectos/banco.jpg"
                    },
                    {
                        url: "../img-vista-proyecto/foto4.jpg"
                    },
                    {
                        url: "../img-vista-proyecto/foto6.jpg"
                    }
                ],
                descripcion: "Descripcion proyecto",
                botones: [
                    {
                        imagen: "../img-botones/descargas.png",
                        texto: "Descargar",
                        color: "#07e71b",
                        url: "facebook.com"
                    },
                    {
                        imagen: "../img-botones/descargas.png",
                        texto: "Descargar",
                        color: "#07e71b",
                        url: "facebook.com"
                    },
                    {
                        imagen: "../img-botones/descargas.png",
                        texto: "Descargar",
                        color: "#07e71b",
                        url: "facebook.com"
                    }
                ]
            }
        ]
    },
    contacto: {
        id: "4",
        activo: false,
        orden: 4,
        titulo: "Contacto",
        orientacionTitulo: "center",
        colorTitulo: "#000",
        colorFondo: "#ffff",
        colorBoton: "#1a5fad",
        colorTextoBoton: "#ffff",
        colorBordes: "#000"
    }
}