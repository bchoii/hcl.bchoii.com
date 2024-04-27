type Listener = (e?: any) => void;

export function subscribe(eventName: string, listener: Listener) {
  document.addEventListener(eventName, listener);
}

export function unsubscribe(eventName: string, listener: Listener) {
  document.removeEventListener(eventName, listener);
}

export function publish(eventName: string, detail?: any) {
  const event = new CustomEvent(eventName, { detail });
  document.dispatchEvent(event);
}
