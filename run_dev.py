import os
import argparse
import shutil
import socket
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"
BACKEND_DIR  = PROJECT_ROOT / "backend"
ADMIN_DIR    = PROJECT_ROOT / "admin"

FRONTEND_PORT = 3000
BACKEND_PORT  = 4000
ADMIN_PORT    = 3001


def parse_args():
    parser = argparse.ArgumentParser(
        description="Start the Saints Productions full stack (frontend + backend + admin)."
    )
    parser.add_argument(
        "--prod",
        action="store_true",
        help="Build and run all apps in production mode.",
    )
    parser.add_argument(
        "--docker",
        action="store_true",
        help="Start the full stack via docker-compose instead of running processes directly.",
    )
    parser.add_argument(
        "--backend-only",
        action="store_true",
        help="Start only the backend + database (requires Docker for Postgres).",
    )
    return parser.parse_args()


def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


def print_header():
    clear_screen()
    print("==================================================", flush=True)
    print("   SAINTS PRODUCTIONS - FULL STACK DEV SERVER    ", flush=True)
    print("==================================================", flush=True)
    print("   Frontend  : Next.js  ->  http://localhost:3000 ", flush=True)
    print("   Backend   : Express  ->  http://localhost:4000 ", flush=True)
    print("   Admin     : Next.js  ->  http://localhost:3001 ", flush=True)
    print("   Database  : Postgres ->  localhost:5432        ", flush=True)
    print("==================================================\n", flush=True)


def find_command(command: str) -> str:
    executable = f"{command}.cmd" if os.name == "nt" else command
    resolved = shutil.which(executable) or shutil.which(command)
    if not resolved:
        print(f"[-] ERROR: '{command}' is not installed or not in PATH.", flush=True)
        sys.exit(1)
    return resolved


def run_checked(command: list[str], cwd: Path | None = None):
    subprocess.run(command, cwd=cwd, check=True)


def is_port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(("127.0.0.1", port)) == 0


def wait_for_port(port: int, label: str, timeout: int = 60):
    for _ in range(timeout):
        if is_port_open(port):
            print(f"[+] {label} is ready on port {port}.", flush=True)
            return True
        time.sleep(1)
    print(f"[-] Timed out waiting for {label} on port {port}.", flush=True)
    return False


def open_browser_when_ready(port: int):
    url = f"http://localhost:{port}"
    for _ in range(60):
        if is_port_open(port):
            webbrowser.open(url)
            return
        time.sleep(1)


def check_node_deps():
    print("[*] Checking system requirements...", flush=True)
    node = find_command("node")
    npm  = find_command("npm")
    run_checked([node, "-v"])
    run_checked([npm,  "-v"])
    print("[+] Node.js and NPM found.\n", flush=True)
    return npm


def check_docker():
    docker_compose = shutil.which("docker-compose") or shutil.which("docker")
    if not docker_compose:
        print("[-] ERROR: docker / docker-compose not found in PATH.", flush=True)
        sys.exit(1)
    return docker_compose


def install_deps(npm: str):
    for label, directory in [("frontend", FRONTEND_DIR), ("backend", BACKEND_DIR), ("admin", ADMIN_DIR)]:
        if directory.exists():
            print(f"[*] Installing {label} dependencies...", flush=True)
            run_checked([npm, "install"], cwd=directory)
    print()


def start_backend_dev(npm: str) -> subprocess.Popen:
    print("[*] Starting backend (tsx watch)...", flush=True)
    env = {**os.environ}
    return subprocess.Popen(
        [npm, "run", "dev"],
        cwd=BACKEND_DIR,
        env=env,
    )


def start_frontend_dev(npm: str, production: bool) -> subprocess.Popen:
    if production:
        print("[*] Building frontend...", flush=True)
        run_checked([npm, "run", "build"], cwd=FRONTEND_DIR)
        cmd = [npm, "run", "start", "--", "-p", str(FRONTEND_PORT)]
    else:
        cmd = [npm, "run", "dev", "--", "--port", str(FRONTEND_PORT)]
    print("[*] Starting frontend...", flush=True)
    return subprocess.Popen(cmd, cwd=FRONTEND_DIR)


def start_admin_dev(npm: str, production: bool) -> subprocess.Popen:
    if production:
        print("[*] Building admin...", flush=True)
        run_checked([npm, "run", "build"], cwd=ADMIN_DIR)
        cmd = [npm, "run", "start", "--", "-p", str(ADMIN_PORT)]
    else:
        cmd = [npm, "run", "dev", "--", "--port", str(ADMIN_PORT)]
    print("[*] Starting admin...", flush=True)
    return subprocess.Popen(cmd, cwd=ADMIN_DIR)


def run_docker(prod: bool):
    docker = check_docker()
    compose_file = PROJECT_ROOT / "docker-compose.yml"
    if not compose_file.exists():
        print("[-] docker-compose.yml not found in project root.", flush=True)
        sys.exit(1)

    cmd_base = ["docker", "compose"] if "docker" in docker else ["docker-compose"]
    build_flag = ["--build"] if prod else ["--build"]

    print("[*] Starting full stack with Docker Compose...\n", flush=True)
    proc = subprocess.Popen(cmd_base + ["up"] + build_flag, cwd=PROJECT_ROOT)

    threading.Thread(target=open_browser_when_ready, args=(FRONTEND_PORT,), daemon=True).start()

    try:
        proc.wait()
    except KeyboardInterrupt:
        print("\n[*] Stopping Docker Compose...", flush=True)
        subprocess.run(cmd_base + ["down"], cwd=PROJECT_ROOT)
        print("[*] All services stopped. Goodbye!", flush=True)
        sys.exit(0)


def run_local(npm: str, production: bool):
    if not is_port_open(5432):
        print("[!] WARNING: Postgres does not appear to be running on port 5432.", flush=True)
        print("    The backend will fail to start without it.", flush=True)
        print("    Tip: run 'docker-compose up db' in another terminal.\n", flush=True)

    install_deps(npm)

    processes: list[subprocess.Popen] = []

    backend_proc = start_backend_dev(npm)
    processes.append(backend_proc)

    print("[*] Waiting for backend to become ready...", flush=True)
    wait_for_port(BACKEND_PORT, "Backend")

    frontend_proc = start_frontend_dev(npm, production)
    processes.append(frontend_proc)

    admin_proc = start_admin_dev(npm, production)
    processes.append(admin_proc)

    threading.Thread(target=open_browser_when_ready, args=(FRONTEND_PORT,), daemon=True).start()

    print("\n[*] All services started. Press CTRL+C to stop everything.\n", flush=True)
    print("==================================================", flush=True)

    try:
        for proc in processes:
            proc.wait()
    except KeyboardInterrupt:
        print("\n\n[*] Stopping all services...", flush=True)
        for proc in processes:
            proc.terminate()
        print("[*] All services stopped. Goodbye!", flush=True)
        sys.exit(0)


if __name__ == "__main__":
    args = parse_args()
    print_header()

    if args.docker:
        run_docker(args.prod)
    else:
        npm_path = check_node_deps()
        run_local(npm_path, args.prod)
