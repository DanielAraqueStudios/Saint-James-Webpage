import os
import subprocess
import sys
import webbrowser
import time

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header():
    clear_screen()
    print("==================================================")
    print("   SAINT JAMES HQ - DEVELOPMENT SERVER STARTUP    ")
    print("==================================================")
    print("   Architecture: Next.js + React + Tailwind + TS  ")
    print("==================================================\n")

def check_dependencies():
    print("[*] Checking system requirements...")
    try:
        # Use shell=True for node/npm on Windows to resolve PATH properly
        subprocess.run(["node", "-v"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        subprocess.run(["npm", "-v"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        print("[+] Node.js and NPM are found in PATH.\n")
    except FileNotFoundError:
        print("[-] ERROR: Node.js or NPM is not installed or not in PATH.")
        print("    Please install Node.js from https://nodejs.org/")
        sys.exit(1)

def run_server():
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    
    if not os.path.exists(frontend_dir):
        print(f"[-] ERROR: Could not find the 'frontend' directory at {frontend_dir}")
        print("    Make sure you are running this script from the project root.")
        sys.exit(1)

    print(f"[*] Navigating to {frontend_dir}...")
    os.chdir(frontend_dir)

    print("[*] Installing dependencies (just in case)...")
    subprocess.run(["npm", "install"], shell=True)

    print("\n[*] Starting Next.js development server...")
    print("[*] Your browser will open automatically in a few seconds.\n")
    print("Press CTRL+C at any time to stop the server.\n")
    print("==================================================")
    
    # Open browser after a slight delay to allow server to start
    def open_browser():
        time.sleep(4)
        webbrowser.open("http://localhost:3000")
    
    import threading
    threading.Thread(target=open_browser).start()

    # Run the dev server
    try:
        # Use shell=True for Windows compatibility with npm commands
        subprocess.run(["npm", "run", "dev"], shell=True, check=True)
    except KeyboardInterrupt:
        print("\n\n[*] Server stopped by user. Goodbye!")
        sys.exit(0)
    except subprocess.CalledProcessError as e:
        print(f"\n[-] ERROR: Server crashed or failed to start. Code: {e.returncode}")
        sys.exit(1)

if __name__ == "__main__":
    print_header()
    check_dependencies()
    run_server()
