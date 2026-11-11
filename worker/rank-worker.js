// 클로드혼 공용 랭킹 서버 (Cloudflare Worker + KV)
// KV 네임스페이스를 변수 이름 RANK 로 바인딩해야 합니다.
const ORIGINS = ['https://skang1310.github.io', 'http://localhost:8790'];
const KEEP = 50;
const today = () => { const k = new Date(Date.now() + 9 * 3600e3); return Math.floor((Date.UTC(k.getUTCFullYear(), k.getUTCMonth(), k.getUTCDate()) - Date.UTC(2026, 10, 10)) / 864e5) + 1; };
const score = r => r.w ? 1e6 + (400 - r.s) : Math.log10(Math.max(1, r.v)) * 100;
const clean = s => String(s || '').replace(/[\u0000-\u001f<>&"'`\\]/g, '').trim().slice(0, 12) || '익명';

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0], 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'content-type', 'Vary': 'Origin' };
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const url = new URL(req.url);
    try {
      if (req.method === 'GET' && url.pathname === '/top') {
        const day = Math.max(1, parseInt(url.searchParams.get('day'), 10) || today());
        const top = (await env.RANK.get('day:' + day, 'json')) || [];
        return json({ day, top: top.slice(0, 20) });
      }
      if (req.method === 'POST' && url.pathname === '/score') {
        if (!ORIGINS.includes(origin)) return json({ error: 'origin' }, 403);
        const b = await req.json();
        const day = today();
        if (Math.abs((b.day | 0) - day) > 1) return json({ error: 'day' }, 400);
        const r = { n: clean(b.name), m: ['Haiku', 'Sonnet', 'Opus'].includes(b.model) ? b.model : 'Sonnet', w: b.win ? 1 : 0, s: Math.round(+b.sec) || 0, v: +b.worth || 0, l: Math.min(60, Math.max(1, b.lvl | 0)), t: Date.now() };
        if (r.s < 25 || r.s > 400 || !(r.v > 0) || r.v > 1e15) return json({ error: 'range' }, 400);
        const key = 'day:' + (b.day | 0);
        const top = (await env.RANK.get(key, 'json')) || [];
        const i = top.findIndex(x => x.n === r.n);
        if (i < 0) top.push(r); else if (score(r) > score(top[i])) top[i] = r;
        top.sort((a, b2) => score(b2) - score(a));
        const kept = top.slice(0, KEEP);
        await env.RANK.put(key, JSON.stringify(kept), { expirationTtl: 60 * 86400 });
        return json({ day: b.day | 0, rank: kept.findIndex(x => x.n === r.n) + 1, top: kept.slice(0, 20) });
      }
      return json({ ok: true, service: 'claude-hon-rank' });
    } catch (e) { return json({ error: 'server' }, 500); }
  },
};
