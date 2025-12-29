export interface Env {
  SITE_KV: KVNamespace;
  ADMIN_TOKEN: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const value = await env.SITE_KV.get(key, { type: "json" });

  return new Response(JSON.stringify({ value }), {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const adminToken = request.headers.get("x-admin-token");

  if (adminToken !== env.ADMIN_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json<{ key?: string; value?: unknown }>();

  if (!body.key) {
    return new Response("Missing key", { status: 400 });
  }

  await env.SITE_KV.put(body.key, JSON.stringify(body.value ?? null));

  return

