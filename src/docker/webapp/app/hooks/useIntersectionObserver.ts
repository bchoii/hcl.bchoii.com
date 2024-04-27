export function useIntersectionObserver<T extends HTMLElement>(
  root: HTMLDivElement | null,
  refs: T[],
  onIntersect: (entry: IntersectionObserverEntry) => void
) {
  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      console.log("---");
      for (const entry of entries) {
        console.log(entry.isIntersecting ? "+" : "-", entry.target.id);
      }
      for (const entry of entries) if (entry.isIntersecting) onIntersect(entry);
    },
    { rootMargin: "0% 0% -100% 0%" }
  );

  for (const ref of refs) {
    if (ref) observer.observe(ref);
  }

  return () => {
    for (const ref of refs) {
      if (ref) observer.unobserve(ref);
    }
    observer.disconnect();
  };
}
