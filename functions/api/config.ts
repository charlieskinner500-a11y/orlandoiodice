export interface Env {
  SITE_KV: KVNamespace;
  ADMIN_TOKEN: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  const key = url.searchParams.get("key");
  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const value = await env.SITE_KV.get(key, { type: "json" });

  return new Response(JSON.stringify({ value }), {
    headers: {
      "content-type": "application/json",
      // 🔥
