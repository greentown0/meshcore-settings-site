/**
 * Cloudflare Pages Function — root redirect based on browser language.
 * Reads the Accept-Language header and redirects to /nl/ if Dutch is the
 * primary preference, otherwise to /en/.
 *
 * Examples of Accept-Language values that route to /nl/:
 *   nl, nl-NL, nl-BE, nl;q=0.9,...
 */
export async function onRequest(context) {
  const acceptLanguage = context.request.headers.get("Accept-Language") ?? "";
  const primaryLang = acceptLanguage.split(",")[0].split(";")[0].trim().toLowerCase();
  const destination = primaryLang.startsWith("nl") ? "/nl/" : "/en/";
  return Response.redirect(new URL(destination, context.request.url).href, 302);
}
