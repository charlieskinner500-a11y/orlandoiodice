export async function onRequestGet({ request, env }) {
  if (request.headers.get("x-admin-token") !== env.ADMIN_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "config";

  const raw = await env.SITE_KV.get(key);
  const value = raw ? JSON.parse(raw) : null;

  return new Response(JSON.stringify({ value }), {
    headers: { "content-type": "application/json" },
  });
}
