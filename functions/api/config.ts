export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const value = await env.SITE_KV.get(key);
  return new Response(
    JSON.stringify({ value: value ? JSON.parse(value) : null }),
    { headers: { "Content-Type": "application/json" } }
  );
}





