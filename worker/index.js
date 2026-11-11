// 클로드혼: 정적 파일 + 공용 랭킹 API (/api/top, /api/score)
// 저장소는 Durable Object(SQLite) 하나를 쓰므로 대시보드에서 따로 만들 것이 없습니다.
import { DurableObject } from 'cloudflare:workers';

const ORIGINS = ['https://skang1310.github.io', 'https://claude-hon.skang1310-336.workers.dev', 'http://localhost:8790'];
const KEEP = 50;
const today = () => { const k = new Date(Date.now() + 9 * 3600e3); return Math.floor((Date.UTC(k.getUTCFullYear(), k.getUTCMonth(), k.getUTCDate()) - Date.UTC(2026, 10, 10)) / 864e5) + 1; };
const score = r => r.w ? 1e6 + (400 - r.s) : Math.log10(Math.max(1, r.v)) * 100;
const clean = s => String(s || '').replace(/[\u0000-\u001f<>&"'`\\]/g, '').trim().slice(0, 12) || '익명';

export class Rank extends DurableObject {
  async top(day) { return ((await this.ctx.storage.get('day:' + day)) || []).slice(0, 20); }
  async submit(day, r) {
    const key = 'day:' + day, list = (await this.ctx.storage.get(key)) || [];
    const i = list.findIndex(x => x.n === r.n);
    if (i < 0) list.push(r); else if (score(r) > score(list[i])) list[i] = r;
    list.sort((a, b) => score(b) - score(a));
    const kept = list.slice(0, KEEP);
    await this.ctx.storage.put(key, kept);
    await this.ctx.storage.delete('day:' + (day - 60));
    return { rank: kept.findIndex(x => x.n === r.n) + 1, top: kept.slice(0, 20) };
  }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req);
    const origin = req.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0], 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'content-type', 'Vary': 'Origin' };
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    try {
      const rank = env.RANK.get(env.RANK.idFromName('global'));
      if (req.method === 'GET' && url.pathname === '/api/top') {
        const day = Math.max(1, parseInt(url.searchParams.get('day'), 10) || today());
        return json({ day, top: await rank.top(day) });
      }
      if (req.method === 'POST' && url.pathname === '/api/score') {
        if (!ORIGINS.includes(origin)) return json({ error: 'origin' }, 403);
        const b = await req.json(), day = b.day | 0;
        if (Math.abs(day - today()) > 1) return json({ error: 'day' }, 400);
        const r = { n: clean(b.name), m: ['Haiku', 'Sonnet', 'Opus'].includes(b.model) ? b.model : 'Sonnet', w: b.win ? 1 : 0, s: Math.round(+b.sec) || 0, v: +b.worth || 0, l: Math.min(60, Math.max(1, b.lvl | 0)), t: Date.now() };
        if (r.s < 25 || r.s > 400 || !(r.v > 0) || r.v > 1e15) return json({ error: 'range' }, 400);
        return json({ day, ...(await rank.submit(day, r)) });
      }
      return json({ ok: true, service: 'claude-hon' });
    } catch (e) { return json({ error: 'server' }, 500); }
  },
};
