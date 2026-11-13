import { SessionClient } from "@/types";

/**
 * Reads hold state from the SDK, falling back if the client is not ready.
 *
 * `isUserOnHold` and `getOnHoldUsers` read client state that only exists once the
 * session has been joined — before that they throw `"read before initial"`. The toolkit mounts well
 * ahead of `init()`/`join()`, so every call site has to tolerate that.
 *
 * This is best-effort seeding only: the authoritative updates arrive via the `on-hold-change`
 * event and the participant change events, both of which fire after the client is ready.
 *
 * @param read - Reads the value from the client.
 * @param fallback - Returned when the client is not ready yet.
 * @returns The value read, or `fallback` if the client is not ready.
 */
export function readHoldState<T>(read: () => T, fallback: T): T {
  try {
    return read();
  } catch {
    return fallback;
  }
}

export const readIsSelfOnHold = (client: SessionClient) => readHoldState(() => !!client.isUserOnHold(), false);

/**
 * Same read as {@link readIsSelfOnHold}, but `undefined` when the client is not ready.
 * Callers that already have a value — a waiting user reconnecting — must not treat "not ready"
 * as "admitted".
 */
export const readIsSelfOnHoldIfReady = (client: SessionClient): boolean | undefined => {
  try {
    return !!client.isUserOnHold();
  } catch {
    return undefined;
  }
};

/** Returns [] for anyone who is not a host or manager. */
export const readOnHoldUsers = (client: SessionClient) => readHoldState(() => client.getOnHoldUsers() ?? [], []);
