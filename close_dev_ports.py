import argparse
import os
import signal
import subprocess
import sys
from collections import defaultdict


DEFAULT_PORTS = range(3000, 3011)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Close local development servers listening on selected ports."
    )
    parser.add_argument(
        "ports",
        nargs="*",
        type=int,
        help="Ports to close. Defaults to 3000-3010.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show matching processes without stopping them.",
    )
    return parser.parse_args()


def find_windows_listeners(ports: set[int]) -> dict[int, set[int]]:
    result = subprocess.run(
        ["netstat", "-ano", "-p", "tcp"],
        check=True,
        capture_output=True,
        text=True,
    )

    listeners: dict[int, set[int]] = defaultdict(set)

    for line in result.stdout.splitlines():
        columns = line.split()
        if len(columns) < 5 or columns[0] != "TCP":
            continue

        local_address = columns[1]
        state = columns[3]
        pid = columns[4]

        if state != "LISTENING" or ":" not in local_address:
            continue

        try:
            port = int(local_address.rsplit(":", 1)[1])
            process_id = int(pid)
        except ValueError:
            continue

        if port in ports:
            listeners[port].add(process_id)

    return listeners


def stop_process(pid: int, dry_run: bool):
    if dry_run:
        print(f"[*] Dry run: would stop PID {pid}", flush=True)
        return

    if os.name == "nt":
        subprocess.run(["taskkill", "/PID", str(pid), "/F"], check=False)
        return

    try:
        os.kill(pid, signal.SIGTERM)
    except ProcessLookupError:
        pass


def main():
    args = parse_args()
    ports = set(args.ports or DEFAULT_PORTS)

    if not ports:
        print("[-] No ports selected.", flush=True)
        return 1

    if os.name != "nt":
        print("[-] This helper currently supports Windows only.", flush=True)
        return 1

    print(f"[*] Checking ports: {', '.join(str(port) for port in sorted(ports))}", flush=True)

    listeners = find_windows_listeners(ports)
    if not listeners:
        print("[+] No matching development servers are listening.", flush=True)
        return 0

    stopped_pids: set[int] = set()
    for port in sorted(listeners):
        for pid in sorted(listeners[port]):
            print(f"[*] Port {port} is held by PID {pid}.", flush=True)
            if pid not in stopped_pids:
                stop_process(pid, args.dry_run)
                stopped_pids.add(pid)

    if args.dry_run:
        print("[+] Dry run complete. No processes were stopped.", flush=True)
    else:
        print("[+] Development ports closed.", flush=True)

    return 0


if __name__ == "__main__":
    sys.exit(main())
