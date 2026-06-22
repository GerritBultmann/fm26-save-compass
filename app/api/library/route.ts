type LibraryPayload = {
  playerImages?: Record<string, string>;
  snapshots?: unknown[];
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    status,
  });
}

function textToBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export async function POST(request: Request) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const githubToken = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const dataPath = process.env.GITHUB_DATA_PATH || "public/data/library.json";

  if (!expectedPassword || !githubToken || !owner || !repo) {
    return jsonResponse(
      {
        error:
          "Server ist nicht fuer GitHub-Uploads konfiguriert. Setze ADMIN_PASSWORD, GITHUB_TOKEN, GITHUB_OWNER und GITHUB_REPO.",
      },
      500
    );
  }

  if (request.headers.get("x-admin-password") !== expectedPassword) {
    return jsonResponse({ error: "Falsches Admin-Passwort." }, 401);
  }

  const payload = (await request.json()) as LibraryPayload;
  if (!Array.isArray(payload.snapshots)) {
    return jsonResponse({ error: "Ungueltige Bibliothek." }, 400);
  }

  const content = JSON.stringify(
    {
      playerImages: payload.playerImages ?? {},
      publishedAt: new Date().toISOString(),
      snapshots: payload.snapshots,
      version: 1,
    },
    null,
    2
  );
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`;
  const headers = {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${githubToken}`,
    "content-type": "application/json",
    "user-agent": "fm26-save-compass",
    "x-github-api-version": "2022-11-28",
  };

  const current = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
  let sha: string | undefined;
  if (current.ok) {
    const currentJson = (await current.json()) as { sha?: string };
    sha = currentJson.sha;
  } else if (current.status !== 404) {
    return jsonResponse({ error: "Aktuelle GitHub-Datei konnte nicht gelesen werden." }, 502);
  }

  const update = await fetch(apiUrl, {
    body: JSON.stringify({
      branch,
      content: textToBase64(content),
      message: "Update FM public library",
      sha,
    }),
    headers,
    method: "PUT",
  });

  if (!update.ok) {
    const details = await update.text();
    return jsonResponse({ error: "GitHub-Upload fehlgeschlagen.", details }, 502);
  }

  return jsonResponse({ ok: true });
}
