export type LogEntry = {
  id: number;
  time: string;
  level: "info" | "success" | "error";
  message: string;
};

type Listener = (logs: LogEntry[]) => void;

const MAX_LOGS = 200;
let logs: LogEntry[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((l) => l(logs));
}

export function subscribeLogs(listener: Listener): () => void {
  listeners.add(listener);
  listener(logs);
  return () => listeners.delete(listener);
}

export function pushLog(level: LogEntry["level"], message: string) {
  const entry: LogEntry = {
    id: nextId++,
    time: new Date().toLocaleTimeString(),
    level,
    message,
  };
  logs = [...logs, entry].slice(-MAX_LOGS);
  emitChange();
}

export function clearLogs() {
  logs = [];
  emitChange();
}
