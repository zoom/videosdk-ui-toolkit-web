import mitt from "mitt";

const emitter = mitt();

/**
 * Emit the event inside component view for exposing APIs or updating UI states.
 * @param eventName the event name of the internal event. Check 'InternalEvents' in the 'constant/event-constants.ts'.
 * @param data data emitted from the event.
 */
export const emit = (eventName: string, data: any) => {
  emitter.emit(eventName, data);
};

/**
 * Add event listeners for the events emitted by emit() above.
 * @param eventName the event name of the internal event. Check 'InternalEvents' in the 'constant/event-constants.ts'.
 * @param callback callback functions to be added.
 */
export const onEvent = (eventName: string, callback: (payload: any) => void) => {
  emitter.on(eventName, callback);
};

/**
 * Remove event listeners for the events emitted by emit() above.
 * @param eventName the event name of the internal event. Check 'InternalEvents' in the 'constant/event-constants.ts'.
 * @param callback callback functions to be removed.
 */
export const offEvent = (eventName: string, callback: (payload: any) => void) => {
  emitter.off(eventName, callback);
};
