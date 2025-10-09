# 🚀 Proyecto Portafolio Personalizable

Aplicación desarrollada en **React (Vite)** que permite crear y editar un portafolio personal configurable por módulos

---

## 📦 Dependencias necesarias

Asegurate de tener instaladas las siguientes herramientas antes de comenzar:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- npm (viene incluido con Node) o yarn

---

## ⚙️ Instalación

1. Cloná el repositorio:
    ```bash
    git clone https://github.com/kevinleichner/portafolio_personalizable.git
    cd portafolio_personalizable

2. Instalá las dependencias:
    ```bash
    npm install

3. Creá un archivo .env en la raíz del proyecto con las siguientes variables (usá el ejemplo de .env.template):
    ```bash
    cp .env.template .env

4. Iniciá el entorno de desarrollo:
    ```bash
    npm run dev

---

## 🧩 Variables de entorno

Debés crear un archivo .env con las siguientes variables:

| Variable              | Descripción                                        | Ejemplo                                                |
| --------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| `VITE_API_URL`        | URL base del backend                               | `http://localhost:1234/api`                            |
| `VITE_URL_BASE`       | URL base del frontend                              | `http://localhost:4321/`                               |
| `VITE_CLOUDINARY_URL` | URL del endpoint de Cloudinary para subir imágenes | `https://api.cloudinary.com/v1_1/tu-cloud-name/upload` |


También podés usar el archivo .env.template incluido en el proyecto como guía.