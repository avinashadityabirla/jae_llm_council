# Azure Deployment Design — JAE JD Creator

## Goal

Host the existing local (frontend + backend + Postgres) app on a public Azure
URL, built as a container image pushed to Azure Container Registry (ACR) and
run on Azure App Service (Web App for Containers), with CI/CD via GitHub
Actions.

## Architecture

Single container, single Web App. The Express backend serves the built Vite
frontend (`frontend/dist`) as static files and the `/api/*` routes from the
same process, on the same origin. This avoids CORS entirely and keeps the
deployment surface to one image, one ACR repo, one Web App.

Postgres is NOT in the container — it's Azure Database for PostgreSQL
Flexible Server, a separate managed resource, reached over the public
endpoint with `sslmode=require`.

```
GitHub (push to main)
  -> GitHub Actions: docker build -> push to ACR
  -> Web App pulls new image, restarts

Browser -> Web App (jae-llmcouncil.centralindia-01.azurewebsites.net)
             -> Express serves frontend/dist (static)
             -> Express /api/* -> Postgres (Azure Flexible Server)
                                -> Azure OpenAI (existing PTU endpoint)
```

## Provisioned resources (already created)

| Resource | Value |
|---|---|
| Resource Group | `RG-Environment9` |
| ACR | `jaellmcouncil.azurecr.io` — Central India, Basic SKU, admin user enabled |
| Postgres Flexible Server | `jae-llm-council.postgres.database.azure.com` — South India, admin `jae_llm_council`, DB `jae_jd_creator`, public access from Azure services allowed |
| App Service Plan | Linux, B1, Central India |
| Web App | `jae-llmcouncil` → `jae-llmcouncil-a4cud8e7d7gda9bw.centralindia-01.azurewebsites.net` — Container publish, port 4000 |

## Components to build

### 1. Dockerfile (repo root)

Multi-stage build:
- Stage 1 (`node:20-alpine`): `npm ci` + `npm run build` in `frontend/`
- Stage 2 (`node:20-alpine`): `npm ci --omit=dev` in `backend/`, copy
  `frontend/dist` into a location the backend can serve statically, copy
  backend source, `CMD ["node", "server.js"]`, `EXPOSE 4000`

### 2. Backend: serve the frontend build

`backend/server.js` needs a static file handler (`express.static`) pointing
at the copied frontend build directory, plus a catch-all that returns
`index.html` for non-`/api` GET routes (client-side routing support), added
*before* the existing 404 handler.

### 3. Frontend: relative API base URL

Currently every fetch/axios call hardcodes `http://localhost:4000`. Since
frontend and backend now share an origin in production, these must become
relative (`/api/...`) or read from a build-time env var
(`VITE_API_BASE`, defaulting to `/api`). Files affected:
`src/api/client.js`, `src/App.jsx`, `src/components/SettingsPage.jsx`,
`src/store/useJDStore.js`.

This must stay backward-compatible with local dev (`npm run dev` on
`:5173` talking to backend on `:4000`) — use Vite's dev proxy
(`vite.config.js` → `server.proxy['/api']`) so `/api` resolves correctly
in both environments without an env var switch.

### 4. Database schema

Run `backend/db/schema.sql` once against the Azure Postgres server via
`psql` from a local machine (public access is allowed). Not automated —
one-time setup, re-run only if schema changes.

### 5. App Settings (Web App configuration, not code)

| Key | Value |
|---|---|
| `DATABASE_URL` | `postgres://jae_llm_council:<password>@jae-llm-council.postgres.database.azure.com:5432/jae_jd_creator?sslmode=require` |
| `AZURE_OPENAI_ENDPOINT` | existing PTU endpoint |
| `AZURE_OPENAI_API_KEY` | existing PTU key |
| `AZURE_OPENAI_DEPLOYMENT` | `ABC-PROD-GPT-PTU-ALLBOTS` |
| `PORT` | `4000` |
| `WEBSITES_PORT` | `4000` |
| `NODE_ENV` | `production` |

Plus the Web App's container registry credentials (ACR admin username +
password) so it can pull from `jaellmcouncil.azurecr.io`.

### 6. GitHub Actions workflow (`.github/workflows/deploy.yml`)

On push to `main`:
1. `docker build` the image from the repo root Dockerfile
2. Log in to ACR, push as `jaellmcouncil.azurecr.io/jae-jd-creator:latest`
   (and `:<git-sha>` for traceability)
3. Trigger the Web App to pull the new image (`az webapp restart` or the
   `azure/webapps-deploy` action pointed at the new tag)

Requires repo secrets: `ACR_LOGIN_SERVER`, `ACR_USERNAME`, `ACR_PASSWORD`,
plus Azure credentials for the deploy step (`AZURE_CREDENTIALS` service
principal, or `publish-profile` from the Web App).

## Error handling / operational notes

- If Azure OpenAI or Postgres is unreachable, the existing health-check
  behavior (`/api/system/health`) already degrades gracefully — no new
  error handling needed there.
- First deploy will fail to pull (`jae-jd-creator:latest` doesn't exist in
  ACR yet) until step 6 runs once — expected, not a bug.
- Secrets live only in Web App Application Settings and GitHub repo
  secrets — never committed to the repo.

## Out of scope (deliberately deferred)

- Custom domain / TLS cert beyond the default `azurewebsites.net`
- Staging slot / blue-green deploy
- Azure Key Vault (App Settings is sufficient per current decision)
- Autoscaling beyond the B1 plan
