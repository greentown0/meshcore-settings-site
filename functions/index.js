/**
 * Cloudflare Pages Function — root redirect with country detection.
 * Handles requests to / and redirects to the appropriate language version.
 * CF-IPCountry is injected by Cloudflare automatically.
 */
export async function onRequest(context) {
  const country = context.request.cf?.country ?? "";
  const destination = country === "NL" ? "/nl/" : "/en/";
  return Response.redirect(new URL(destination, context.request.url).href, 302);
}
