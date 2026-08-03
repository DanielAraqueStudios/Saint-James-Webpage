export type Toast = {
  id: number;
  type: "error" | "success" | "info";
  message: string;
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((l) => l(toasts));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  listener(toasts);
  return () => listeners.delete(listener);
}

export function pushToast(type: Toast["type"], message: string) {
  const id = nextId++;
  toasts = [...toasts, { id, type, message }];
  emitChange();
  setTimeout(() => dismissToast(id), 6000);
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emitChange();
}
