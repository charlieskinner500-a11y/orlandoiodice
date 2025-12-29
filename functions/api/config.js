export async function onRequestGet({ request, env }) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const value = await env.SITE_KV.get(key, { type: "json" });

  return new Response(JSON.stringify({ value }), {
    headers: { "Content-Type": "application/json" }
  });
}








