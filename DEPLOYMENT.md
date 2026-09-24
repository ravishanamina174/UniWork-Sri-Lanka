# UniWorkSL deployment

The repository contains three applications. Deploy only `backend` to Render and
`web-client` to Vercel. Do not configure `mobile-client` as either service.

## Local development

1. Copy `backend/.env.example` to `backend/.env` and fill in the database and
   Gemini values.
2. Copy `web-client/.env.example` to `web-client/.env.local` and add the Clerk
   and Google Maps values. Keep `NEXT_PUBLIC_API_URL=http://localhost:8000`.
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
   - `FRONTEND_URL`: the final Vercel URL, for example `https://uniwork-web.vercel.app`
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