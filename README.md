# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

````sh
# create a new project in the current directory
# DashBoard-Prisma-svelte

Proyecto SvelteKit con endpoints server-side (migrado desde un backend Express).

Resumen
- Frontend y endpoints SvelteKit en `src/`
- Endpoints server-side en `src/routes/api/*`
- Configuración server en `src/lib/server/config.js`
- `servers.json` (lectura/escritura) se busca en la raíz o en `backend/`

Cómo correr localmente

1. Instalar dependencias

```powershell
cd C:\codigo\GitHub\railway\svelte\DashBoard-Prisma-svelte
npm ci
````

2. Desarrollo

```powershell
npm run dev
```

3. Build + run (modo producción)

```powershell
npm run build
npm start
```

Variables de entorno necesarias

- DEFAULT_USER - usuario básico para llamadas al API remoto
- DEFAULT_CLAVE - clave para el usuario
- ALLOWED_ORIGINS o FRONTEND_URL - (opcional) para control de CORS

Docker

El `Dockerfile` en la raíz construye y ejecuta la app con Node (adapter-node). Para construir:

```powershell
docker build -t dashboard-prisma-app .
docker run --rm -p 3000:3000 -e DEFAULT_USER='apiprisma' -e DEFAULT_CLAVE='Ulan1234.' dashboard-prisma-app
```

Notas de producción

- No uses `servers.json` como almacenamiento persistente en producción; usa una DB.
- Asegura las env vars en Railway (DEFAULT_USER, DEFAULT_CLAVE, FRONTEND_URL/ALLOWED_ORIGINS).
- Si usas preview deploys en Railway, añade las URLs de preview a `ALLOWED_ORIGINS`.

Contact

Si quieres que haga la integración final (push + validación de deploy), dímelo y lo hago.
