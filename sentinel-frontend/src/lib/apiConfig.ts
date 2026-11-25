const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (import.meta.env.PROD && !configuredBaseUrl) {
  throw new Error(
    "Missing VITE_API_BASE_URL. Set it to https://cyber-anamoly.onrender.com in Vercel and redeploy."
  );
}

let API_BASE_URL = "";

if (configuredBaseUrl) {
  let parsedBaseUrl: URL;

  try {
    parsedBaseUrl = new URL(configuredBaseUrl);
  } catch {
    throw new Error("VITE_API_BASE_URL must be a valid backend origin, such as https://cyber-anamoly.onrender.com.");
  }

  if (parsedBaseUrl.pathname !== "/" || parsedBaseUrl.search || parsedBaseUrl.hash) {
    throw new Error("VITE_API_BASE_URL must contain only the backend origin, without an /api path.");
  }

  if (
    import.meta.env.PROD &&
    (parsedBaseUrl.protocol !== "https:" ||
      ["localhost", "127.0.0.1", "::1"].includes(parsedBaseUrl.hostname))
  ) {
    throw new Error("Production VITE_API_BASE_URL must be the HTTPS Render backend origin, not localhost.");
  }

  API_BASE_URL = parsedBaseUrl.origin;
}

export { API_BASE_URL };

export function apiUrl(path: string): string {
  const normalizedPath = `/${path.replace(/^\/+/, "")}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
