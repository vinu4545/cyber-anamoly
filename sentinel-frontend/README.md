# SENTINEL AI frontend
React + Vite + TypeScript + Tailwind + Framer Motion + Recharts. In local development, `/api` is proxied to the FastAPI backend on `localhost:8000`. Production API requests use `VITE_API_BASE_URL`.

    npm install
    npm run dev        # http://localhost:5173  (backend must be running on port 8000)

## Production deployment

In Vercel, add this environment variable for the **Production** environment:

```text
VITE_API_BASE_URL=https://cyber-anamoly.onrender.com
```

Redeploy the frontend after adding or changing the variable. Vite embeds `VITE_` variables in browser code, so do not put secrets or private API keys in them.

The backend always allows this production frontend origin:

```text
https://cyberflow-sentinel-ai.vercel.app
```

No Render environment variable is required for this origin. Optionally set `FRONTEND_ORIGINS` on Render to a comma-separated list of additional origins. Redeploy Render after changing backend code or its environment variables.
