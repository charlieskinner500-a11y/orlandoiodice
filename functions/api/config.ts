export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "config";

  const value = await env.SITE_KV.get(key, { type: "json" });

  return new Response(JSON.stringify({ value }), {
    headers: { "content-type": "application/json" },
  });
}










