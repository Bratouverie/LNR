import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// saveBlogPost — CRUD for BlogPost via CRM JWT auth (asServiceRole)
//
// Body: {
//   token: string,            // CRM JWT
//   action: 'save'|'delete'|'get'|'list',
//   id?: string,              // for save (update), delete, get
//   data?: object,            // for save (create/update payload)
//   limit?: number,           // for list (default 100)
// }
// Returns: { success, post } | { success, posts } | { success }
// ═══════════════════════════════════════════════════════════════

const encoder = new TextEncoder();

function base64urlToBytes(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function verifyJWT(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;
  const data = `${headerB64}.${payloadB64}`;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const sigBytes = base64urlToBytes(sigB64);
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(data));
  if (!valid) return null;
  const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
  const payload = JSON.parse(payloadJson);
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
  return payload;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, action, id, data, limit } = body;
    if (!token) return Response.json({ error: 'token is required' }, { status: 401 });
    if (!action) return Response.json({ error: 'action is required' }, { status: 400 });

    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) return Response.json({ error: 'Invalid or expired token' }, { status: 401 });

    const caller = await base44.asServiceRole.entities.Manager.get(payload.managerId);
    if (!caller || !caller.isActive || caller.isBlocked) {
      return Response.json({ error: 'Account inactive or blocked' }, { status: 403 });
    }
    if (caller.role !== 'super_admin') {
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    if (action === 'list') {
      const posts = await base44.asServiceRole.entities.BlogPost.list('-date', limit || 100);
      return Response.json({ success: true, posts });
    }

    if (action === 'get') {
      if (!id) return Response.json({ error: 'id is required for get' }, { status: 400 });
      const post = await base44.asServiceRole.entities.BlogPost.get(id);
      return Response.json({ success: true, post });
    }

    if (action === 'delete') {
      if (!id) return Response.json({ error: 'id is required for delete' }, { status: 400 });
      await base44.asServiceRole.entities.BlogPost.delete(id);
      return Response.json({ success: true });
    }

    if (action === 'save') {
      if (!data || !data.title || !data.slug || !data.content) {
        return Response.json({ error: 'title, slug, content are required' }, { status: 400 });
      }
      let post;
      if (id) {
        post = await base44.asServiceRole.entities.BlogPost.update(id, data);
      } else {
        post = await base44.asServiceRole.entities.BlogPost.create(data);
      }
      return Response.json({ success: true, post });
    }

    return Response.json({ error: 'Unknown action: ' + action }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});