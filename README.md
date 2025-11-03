# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

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
```

2. Desarrollo

```powershell
npm run dev
```

3. Build + run (modo producción)

```powershell
npm run build
npm start
```

Docker

El `Dockerfile` en la raíz construye y ejecuta la app con Node (adapter-node). Para construir:

```powershell
docker build -t dashboard-prisma-app .
docker run --rm -p 3000:3000 -e DEFAULT_USER='apiprisma' -e DEFAULT_CLAVE='Ulan1234.' dashboard-prisma-app
```
