#!/usr/bin/env python3
"""에셋 생성용 임시 서버: 브라우저 캔버스가 보낸 PNG(data URL)를 상위 폴더에 저장한다.
사용: python3 tools/save-server.py  →  POST http://localhost:8791/save?name=og.png"""
import base64, os, re
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', 'http://localhost:8790')
        self.send_header('Access-Control-Allow-Headers', 'content-type')
    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()
    def do_POST(self):
        name = parse_qs(urlparse(self.path).query).get('name', [''])[0]
        if not re.fullmatch(r'[a-z0-9-]+\.png', name):
            self.send_response(400); self._cors(); self.end_headers(); return
        body = self.rfile.read(int(self.headers['content-length'])).decode()
        data = base64.b64decode(body.split(',', 1)[1])
        with open(os.path.join(ROOT, name), 'wb') as f: f.write(data)
        self.send_response(200); self._cors(); self.end_headers(); self.wfile.write(str(len(data)).encode())
HTTPServer(('127.0.0.1', 8791), H).serve_forever()
