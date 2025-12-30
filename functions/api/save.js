export async function onRequestPost({ request, env }: any) {
  // admin auth
  const token = request.headers.get("x-admin-token") || "";
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "config";

  const body = await request.json();
  const value = body?.value;

  await env.SITE_KV.put(key, JSON.stringify(value));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "content-type": "application/json" },
  });
}
