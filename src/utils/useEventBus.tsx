import mitt from "mitt";
import { useCallback, useEffect } from "react";
const emitter = mitt();
export default emitter;

export function useEventBus(
  eventName: string,
  handler?: (data?: any) => void,
  deps: any[] = []
) {
  const emit = useCallback((event: string, data?: any) => {
    emitter.emit(event, data);
  }, []);

  useEffect(() => {
    if (handler) {
      emitter.on(eventName, handler);
      return () => emitter.off(eventName, handler);
    }
  }, [eventName, handler, ...deps]);

  return { emit };
}
