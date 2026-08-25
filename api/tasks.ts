export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const GITHUB_TOKEN = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '').trim();
  const OWNER = 'aroshwijesinghe';
  const REPO = 'ToDo';
  const PATH = 'data/tasks.json';
  const BRANCH = 'main';

  const defaultHeaders: Record<string, string> = {
    'User-Agent': 'Priority-ToDo-Vercel-App',
    'Accept': 'application/vnd.github.v3+json',
  };

  if (GITHUB_TOKEN) {
    defaultHeaders['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  // 1. GET: Fetch latest tasks from GitHub repository
  if (req.method === 'GET') {
    try {
      // Direct raw content fetch with timestamp cache-buster
      const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${PATH}?_t=${Date.now()}`;
      const rawRes = await fetch(rawUrl, {
        cache: 'no-cache',
        headers: { 'User-Agent': 'Priority-ToDo-Vercel-App' },
      });

      if (rawRes.ok) {
        const tasks = await rawRes.json();
        if (Array.isArray(tasks)) {
          return res.status(200).json({ success: true, tasks, source: 'raw' });
        }
      }

      // API Fallback
      const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}&_t=${Date.now()}`;
      const apiRes = await fetch(apiUrl, {
        headers: defaultHeaders,
        cache: 'no-cache',
      });

      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.content) {
          const decoded = Buffer.from(json.content.replace(/\s/g, ''), 'base64').toString('utf-8');
          const tasks = JSON.parse(decoded);
          return res.status(200).json({ success: true, tasks, source: 'api' });
        }
      }

      return res.status(404).json({ success: false, message: 'tasks.json not found on GitHub' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. POST: Commit updated tasks to GitHub data/tasks.json
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!GITHUB_TOKEN) {
      return res.status(200).json({
        success: false,
        message: 'GITHUB_TOKEN environment variable not found in Vercel. Set GITHUB_TOKEN in Vercel Settings.',
      });
    }

    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {}
      }

      const tasks = body?.tasks || (Array.isArray(body) ? body : null);
      if (!Array.isArray(tasks)) {
        return res.status(400).json({ success: false, message: 'Invalid payload: array of tasks expected' });
      }

      const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;

      // Get latest SHA of the file from GitHub
      let currentSha: string | undefined;
      const getRes = await fetch(`${apiUrl}?ref=${BRANCH}&_t=${Date.now()}`, {
        headers: defaultHeaders,
        cache: 'no-cache',
      });

      if (getRes.ok) {
        const fileData = await getRes.json();
        currentSha = fileData.sha;
      }

      // Base64 encode JSON content
      const jsonString = JSON.stringify(tasks, null, 2);
      const base64Content = Buffer.from(jsonString, 'utf-8').toString('base64');

      // Commit to GitHub with [skip ci]
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          ...defaultHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Auto-sync tasks database [skip ci]`,
          content: base64Content,
          sha: currentSha,
          branch: BRANCH,
        }),
      });

      if (putRes.ok) {
        return res.status(200).json({
          success: true,
          message: 'Updated GitHub data/tasks.json successfully',
          count: tasks.length,
        });
      } else {
        const errJson = await putRes.json();
        return res.status(putRes.status).json({
          success: false,
          error: errJson.message || 'GitHub commit failed',
        });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
