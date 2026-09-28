"""
EduPulse SIMS - Local Presentation Server
"""
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 5050

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Try finding an open port if 5050 is busy
    port = PORT
    for attempt in range(10):
        try:
            with socketserver.TCPServer(("", port), CustomHandler) as httpd:
                url = f"http://localhost:{port}"
                print("=" * 65)
                print("🎓 EduPulse - Student Information Management System")
                print("   Reviewer Showcase & Presentation Server")
                print("=" * 65)
                print(f"\n[+] Local Server running at: {url}")
                print("[+] Serving directory:", os.getcwd())
                print("[+] Opening browser automatically for reviewer presentation...")
                print("\n[i] Press Ctrl+C in this terminal to stop the server anytime.\n")
                
                try:
                    webbrowser.open(url)
                except Exception as e:
                    print(f"[*] Open browser manually at {url}")

                httpd.serve_forever()
                break
        except OSError:
            port += 1

if __name__ == '__main__':
    main()
