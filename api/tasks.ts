export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GITHUB_TOKEN = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '').trim();
  const OWNER = 'aroshwijesinghe';
  const REPO = 'ToDo';
  const PATH = 'data/tasks.json';
  const BRANCH = 'main';

  const ghHeaders: Record<string, string> = {
    'User-Agent': 'PriorityToDo',
    'Accept': 'application/vnd.github.v3+json',
  };
  if (GITHUB_TOKEN) {
    ghHeaders['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  // ─── GET: Read tasks from GitHub ───
  if (req.method === 'GET') {
    try {
      // Use GitHub Contents API (respects auth, no CDN cache)
      const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`;
      const apiRes = await fetch(apiUrl, { headers: ghHeaders });

      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.content) {
          const decoded = Buffer.from(json.content.replace(/\s/g, ''), 'base64').toString('utf-8');
          const tasks = JSON.parse(decoded);
          return res.status(200).json({ success: true, tasks, sha: json.sha });
        }
      }

      // Fallback: raw URL
      const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${PATH}?_t=${Date.now()}`;
      const rawRes = await fetch(rawUrl, { headers: { 'User-Agent': 'PriorityToDo' } });
      if (rawRes.ok) {
        const tasks = await rawRes.json();
        return res.status(200).json({ success: true, tasks, source: 'raw' });
      }

      return res.status(404).json({ success: false, error: 'tasks.json not found' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // ─── POST: Commit tasks to GitHub ───
  if (req.method === 'POST' || req.method === 'PUT') {
    // Debug: check token presence
    if (!GITHUB_TOKEN) {
      return res.status(200).json({
        success: false,
        error: 'GITHUB_TOKEN not set. Go to Vercel → Settings → Environment Variables and add GITHUB_TOKEN.',
        tokenPresent: false,
      });
    }

    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const tasks = body?.tasks || (Array.isArray(body) ? body : null);
      if (!Array.isArray(tasks)) {
        return res.status(400).json({ success: false, error: 'Expected { tasks: [...] }' });
      }

      const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;

      // 1. Get current file SHA (required for update)
      let currentSha: string | undefined;
      const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers: ghHeaders });

      if (getRes.ok) {
        const fileData = await getRes.json();
        currentSha = fileData.sha;
      } else {
        const getErr = await getRes.text();
        return res.status(200).json({
          success: false,
          error: `Failed to read current file: ${getRes.status} ${getErr}`,
          step: 'get_sha',
        });
      }

      // 2. Encode and commit
      const jsonStr = JSON.stringify(tasks, null, 2);
      const base64 = Buffer.from(jsonStr, 'utf-8').toString('base64');

      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: { ...ghHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Auto-sync tasks [skip ci]`,
          content: base64,
          sha: currentSha,
          branch: BRANCH,
        }),
      });

      if (putRes.ok) {
        const result = await putRes.json();
        return res.status(200).json({
          success: true,
          message: 'Committed to GitHub',
          sha: result?.content?.sha,
          count: tasks.length,
        });
      } else {
        const putErr = await putRes.text();
        return res.status(200).json({
          success: false,
          error: `GitHub commit failed: ${putRes.status} ${putErr}`,
          step: 'put_commit',
        });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
