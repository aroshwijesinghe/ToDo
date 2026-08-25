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

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const OWNER = 'aroshwijesinghe';
  const REPO = 'ToDo';
  const PATH = 'data/tasks.json';
  const BRANCH = 'main';

  // 1. GET: Fetch tasks from GitHub repository
  if (req.method === 'GET') {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${PATH}?_t=${Date.now()}`;
      const response = await fetch(rawUrl, { cache: 'no-cache' });
      if (response.ok) {
        const tasks = await response.json();
        return res.status(200).json({ success: true, tasks });
      }

      // Fallback to GitHub API if raw fails
      const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`;
      const apiRes = await fetch(apiUrl, {
        headers: GITHUB_TOKEN
          ? { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
          : { Accept: 'application/vnd.github.v3+json' },
      });

      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.content) {
          const decoded = Buffer.from(json.content, 'base64').toString('utf-8');
          const tasks = JSON.parse(decoded);
          return res.status(200).json({ success: true, tasks });
        }
      }

      return res.status(404).json({ success: false, message: 'tasks.json not found' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. POST / PUT: Auto-commit updated tasks.json to GitHub repository
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!GITHUB_TOKEN) {
      return res.status(200).json({
        success: false,
        message: 'GITHUB_TOKEN environment variable not set in Vercel settings. Tasks saved locally in browser.',
      });
    }

    try {
      const { tasks } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!Array.isArray(tasks)) {
        return res.status(400).json({ success: false, message: 'Array of tasks expected' });
      }

      const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;

      // Get current file SHA
      let currentSha: string | undefined;
      const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (getRes.ok) {
        const fileData = await getRes.json();
        currentSha = fileData.sha;
      }

      // Base64 encode JSON
      const jsonString = JSON.stringify(tasks, null, 2);
      const base64Content = Buffer.from(jsonString, 'utf-8').toString('base64');

      // Commit to GitHub with [skip ci]
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update tasks.json database [skip ci]`,
          content: base64Content,
          sha: currentSha,
          branch: BRANCH,
        }),
      });

      if (putRes.ok) {
        return res.status(200).json({ success: true, message: 'Updated GitHub data/tasks.json successfully' });
      } else {
        const err = await putRes.json();
        return res.status(putRes.status).json({ success: false, error: err.message });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
