# UniWorkSL deployment

The repository contains three applications. Deploy only `backend` to Render and
`web-client` to Vercel. Do not configure `mobile-client` as either service.

## Local development

1. Copy `backend/.env.example` to `backend/.env` and fill in the database and
   Gemini values.
2. Copy `web-client/.env.example` to `web-client/.env.local` and add the Clerk
   and Google Maps values. For local development, use
   `NEXT_PUBLIC_API_URL=http://localhost:8000`.
3. Start the API from the repository root:

   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

4. Start the web app in a second terminal:

   ```bash
   cd web-client
   npm install
   npm run dev
   ```

The web client uses `NEXT_PUBLIC_API_URL` for HTTP requests and converts that
same URL to `ws://` or `wss://` for WebSockets.

To switch environments, change only `NEXT_PUBLIC_API_URL` and restart Next.js:

```text
# Local web + local API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Deployed web + Render API
NEXT_PUBLIC_API_URL=https://<render-service>.onrender.com
```

Do not append `/api/v1` to the web value; web request paths add that prefix.
For the mobile app, set `EXPO_PUBLIC_API_BASE_URL` to the API URL including
`/api/v1` (for example, `http://192.168.1.3:8000/api/v1` locally).

## Render backend

1. Create a PostgreSQL database with PostGIS support and a MongoDB database.
2. Push this repository to GitHub.
3. In Render, choose **New > Blueprint** and select the repository. The root
   `render.yaml` configures the service, or create a Web Service manually with:
   - Root Directory: `backend`
   - Runtime: Python
   - Python Version: `3.13.4` (already pinned in `backend/runtime.txt`)
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add these environment variables in the Render service:
   - `POSTGRES_URL`: the Render PostgreSQL **internal** connection URL
   - `MONGO_URL`: the MongoDB connection string
   - `GEMINI_API_KEY`: the Gemini API key, if AI enhancement and lookup are enabled
   - `FRONTEND_URL`: comma-separated browser origins, such as
     `http://localhost:3000,https://uniwork-web.vercel.app`, when both local
     development and the deployed web app need to call this backend
5. Deploy and verify `https://<render-service>.onrender.com/` returns
   `{"status":"Engine is running"}`.

`backend/requirements.txt` is the Python dependency file. There is no
`requirements.tsx` file; `.tsx` is a frontend TypeScript/React extension.

## Vercel web client

1. In Vercel, choose **Add New > Project**, import the same GitHub repository,
   and set **Root Directory** to `web-client`. Do not select `mobile-client`.
2. Keep the detected framework as Next.js. The default build command is
   `npm run build`; the output setting should remain automatic.
3. Add these environment variables for Preview and Production:
   - `NEXT_PUBLIC_API_URL`: `https://<render-service>.onrender.com`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
   - `CLERK_SECRET_KEY`: Clerk secret key
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps browser key
   - `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`: `/onboard`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`: `/onboard`
4. Deploy. Copy the final Vercel URL into Render's `FRONTEND_URL`, then redeploy
   the Render service so CORS and credentialed requests use the production web
   origin.
5. In Clerk, add the Vercel domain to allowed origins and redirect URLs. In
   Google Cloud, restrict the Maps browser key to the Vercel domain.

## Production checklist

- Use HTTPS URLs for both services. The WebSocket client will automatically use
  `wss://` when `NEXT_PUBLIC_API_URL` starts with `https://`.
- Never commit `.env`, `.env.local`, or secret keys. Rotate any key that has
  already been exposed outside the secret manager.
- Check Render logs for database connection and table creation errors before
  testing authenticated pages.