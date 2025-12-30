export async function onRequestPost({ request, env }) {
  // 🔐 admin auth
  if (request.headers.get("x-admin-token") !== env.ADMIN_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { value } = await request.json();

  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "config";

  await env.SITE_KV.put(key, JSON.stringify(value));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "content-type": "application/json" },
  });
}
