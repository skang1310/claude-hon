#!/usr/bin/env python3
"""랭킹 서버 모의 구현(로컬 테스트용). 실제 서버는 worker/rank-worker.js"""
import json, math
from http.server import BaseHTTPRequestHandler, HTTPServer
TOP = [{'n': '테스트봇', 'm': 'Opus', 'w': 1, 's': 99, 'v': 3e13, 'l': 12}, {'n': '<b>xss</b>', 'm': 'Haiku', 'w': 0, 's': 150, 'v': 5e9, 'l': 8}]
sc = lambda r: 1e6 + 400 - r['s'] if r['w'] else math.log10(max(1, r['v'])) * 100
class H(BaseHTTPRequestHandler):
    def _h(self, code=200):
        self.send_response(code); self.send_header('Access-Control-Allow-Origin', 'http://localhost:8790'); self.send_header('Access-Control-Allow-Headers', 'content-type'); self.send_header('content-type', 'application/json'); self.end_headers()
    def do_OPTIONS(self): self._h(204)
    def do_GET(self): self._h(); self.wfile.write(json.dumps({'top': TOP}).encode())
    def do_POST(self):
        b = json.loads(self.rfile.read(int(self.headers['content-length'])))
        r = {'n': str(b.get('name', ''))[:12] or '익명', 'm': b.get('model'), 'w': 1 if b.get('win') else 0, 's': b.get('sec'), 'v': b.get('worth'), 'l': b.get('lvl')}
        TOP[:] = [x for x in TOP if x['n'] != r['n']] + [r]; TOP.sort(key=sc, reverse=True)
        self._h(); self.wfile.write(json.dumps({'rank': [x['n'] for x in TOP].index(r['n']) + 1, 'top': TOP}).encode())
    def log_message(self, *a): pass
HTTPServer(('127.0.0.1', 8792), H).serve_forever()
