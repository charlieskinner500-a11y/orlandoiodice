export const onRequestGet: PagesFunction<{
  SITE_KV: KVNamespace;
  ADMIN_TOKEN: string;
}> = async ({ request, env }) => {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const value = await env.SITE_KV.get(key, "json");

  return new Response(
    JSON.stringify({ value }),
    { headers: { "content-type": "application/json" } }
  );
};



