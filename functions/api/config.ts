export async function onRequestGet({ env }) {
  if (!env.SITE_KV) {
    return new Response("SITE_KV MISSING", { status: 500 });
  }

  return new Response("SITE_KV OK");
}






