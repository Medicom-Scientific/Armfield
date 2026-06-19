#!/usr/bin/env python3
"""Minimal HTTP server for the Armfield product explorer.
Hard-codes the project directory so it works regardless of cwd."""
import os, sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

port = int(os.environ.get("PORT", 3456))

os.chdir(PROJECT_DIR)

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # suppress request noise

print(f"Serving {PROJECT_DIR} on port {port}", flush=True)
HTTPServer(("", port), Handler).serve_forever()
