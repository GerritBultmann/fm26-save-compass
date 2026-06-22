function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    status,
  });
}

export async function POST(request: Request) {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return jsonResponse({ error: "ADMIN_PASSWORD ist nicht konfiguriert." }, 500);
  }

  if (request.headers.get("x-admin-password") !== expectedPassword) {
    return jsonResponse({ error: "Falsches Admin-Passwort." }, 401);
  }

  return jsonResponse({ ok: true });
}
