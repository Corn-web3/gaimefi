export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  { callback }: any = {}
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      callback&&callback(...args);
    }
  };
}
