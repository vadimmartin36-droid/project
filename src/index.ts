export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // ------ ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ХЕШИРОВАНИЯ ------
    async function hashPassword(password: string): Promise<string> {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + 'honeygain-salt'); // соль
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ------ РЕГИСТРАЦИЯ ------
    if (path === '/api/auth/register' && request.method === 'POST') {
      try {
        const { username, email, password } = await request.json();
        if (!username || !email || !password) {
          return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
        }

        const passwordHash = await hashPassword(password);
        await env.DB.prepare(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
        ).bind(username, email, passwordHash).run();

        return new Response(JSON.stringify({ message: 'User created' }), { status: 201 });
      } catch (e: any) {
        if (e.message?.includes('UNIQUE constraint failed')) {
          return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
        }
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
      }
    }

    // ------ ВХОД ------
    if (path === '/api/auth/login' && request.method === 'POST') {
      try {
        const { email, password } = await request.json();
        const user: any = await env.DB.prepare(
          'SELECT * FROM users WHERE email = ?'
        ).bind(email).first();

        if (!user) {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }

        const passwordHash = await hashPassword(password);
        if (passwordHash !== user.password_hash) {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }

        const token = crypto.randomUUID();
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

        await env.DB.prepare(
          'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
        ).bind(token, user.id, expiresAt).run();

        return new Response(JSON.stringify({
          token,
          user: { id: user.id, username: user.username, email: user.email }
        }), { status: 200 });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
      }
    }

    // ------ ПОЛУЧЕНИЕ КОММЕНТАРИЕВ ------
    if (path.match(/^\/api\/posts\/[^\/]+\/comments$/) && request.method === 'GET') {
      const slug = path.split('/')[3];
      const comments = await env.DB.prepare(
        `SELECT comments.*, users.username 
         FROM comments 
         JOIN users ON comments.user_id = users.id 
         WHERE post_slug = ? 
         ORDER BY created_at DESC`
      ).bind(slug).all();

      return new Response(JSON.stringify(comments.results), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ------ ДОБАВЛЕНИЕ КОММЕНТАРИЯ ------
    if (path.match(/^\/api\/posts\/[^\/]+\/comments$/) && request.method === 'POST') {
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '');
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }

      const session: any = await env.DB.prepare(
        'SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?'
      ).bind(token, Date.now()).first();

      if (!session) {
        return new Response(JSON.stringify({ error: 'Invalid or expired session' }), { status: 401 });
      }

      const slug = path.split('/')[3];
      const { content } = await request.json();
      if (!content) {
        return new Response(JSON.stringify({ error: 'Missing content' }), { status: 400 });
      }

      await env.DB.prepare(
        'INSERT INTO comments (post_slug, user_id, content) VALUES (?, ?, ?)'
      ).bind(slug, session.user_id, content).run();

      return new Response(JSON.stringify({ message: 'Comment added' }), { status: 201 });
    }

    // ------ ЛАЙК (TOGGLE) ------
    if (path === '/api/like' && request.method === 'POST') {
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '');
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }

      const session: any = await env.DB.prepare(
        'SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?'
      ).bind(token, Date.now()).first();

      if (!session) {
        return new Response(JSON.stringify({ error: 'Invalid or expired session' }), { status: 401 });
      }

      const { targetType, targetId } = await request.json();
      if (!targetType || !targetId) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }

      const existing: any = await env.DB.prepare(
        'SELECT id FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?'
      ).bind(session.user_id, targetType, targetId).first();

      if (existing) {
        await env.DB.prepare(
          'DELETE FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?'
        ).bind(session.user_id, targetType, targetId).run();
        return new Response(JSON.stringify({ message: 'Unliked' }));
      } else {
        await env.DB.prepare(
          'INSERT INTO likes (user_id, target_type, target_id) VALUES (?, ?, ?)'
        ).bind(session.user_id, targetType, targetId).run();
        return new Response(JSON.stringify({ message: 'Liked' }));
      }
    }

    // ------ ПОЛУЧЕНИЕ КОЛИЧЕСТВА ЛАЙКОВ ------
    if (path.match(/^\/api\/likes\/[^\/]+\/\d+$/) && request.method === 'GET') {
      const parts = path.split('/');
      const targetType = parts[3];
      const targetId = parseInt(parts[4]);
      const result: any = await env.DB.prepare(
        'SELECT COUNT(*) as count FROM likes WHERE target_type = ? AND target_id = ?'
      ).bind(targetType, targetId).first();

      return new Response(JSON.stringify({ count: result?.count || 0 }));
    }

    // ------ СТАТИКА (если не API) ------
    // Возвращаем 404, чтобы Cloudflare попробовал отдать статику через assets
    return new Response('Not found', { status: 404 });
  }
};
