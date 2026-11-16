# Técnica Ática - Frontend

Interfaz web para consultar y administrar el catálogo de productos. Está
construida con React, TypeScript, Vite, Tailwind CSS y Axios.

## Requisitos

- Backend de Técnica Ática ejecutándose

## Configuración

Instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` en la raíz del frontend. `VITE_HOST` debe apuntar a la
URL base del backend, incluyendo el prefijo de la API:

```env
VITE_HOST=http://localhost:3000/api/
```

La aplicación usa Axios con credenciales habilitadas y consume las rutas
`/products` del backend.

## Ejecución

```bash
# servidor de desarrollo
npm run dev

# compilación de producción
npm run build

```

La aplicación se sirve normalmente en `http://localhost:5173`.

## Funcionalidades

- Lista los productos disponibles en el catálogo.
- Consulta el detalle de un producto.
- Crea productos con código, nombre, descripción, precio y stock.
- Edita los datos de un producto.
- Elimina productos después de confirmación.
- Muestra estados de carga y formatos de precio en la interfaz.

La pantalla principal está implementada en `src/pages/Product/Product.tsx`.
Las llamadas HTTP se centralizan en `src/services/products.ts` y utilizan la
URL configurada en `VITE_HOST`.
