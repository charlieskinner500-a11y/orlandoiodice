export async function onRequestPost({ request, env }) {
  // 🔐 admin auth
  if (request.headers.get("x-admin-token") !== env.ADMIN_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  // read body: { value: ... }
  const { value } = await request.json();

  // read key from query (?key=config), default to "config"
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "config";

  // ✅ save JUST the value into KV under that key
  await env.SITE_KV.put(key, JSON.stringify(value));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "content-type": "application/json" },
  });
}

// redeploy
//
//