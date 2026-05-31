/**
 * Cloudflare Workers Assets entry point.
 * Handles the root redirect based on browser language preference,
 * then delegates all other requests to the static asset handler.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      const acceptLanguage = request.headers.get("Accept-Language") ?? "";
      const primaryLang = acceptLanguage.split(",")[0].split(";")[0].trim().toLowerCase();
      const destination = primaryLang.startsWith("nl") ? "/nl/" : "/en/";
      return Response.redirect(new URL(destination, request.url).href, 302);
    }

    return env.ASSETS.fetch(request);
  },
};
