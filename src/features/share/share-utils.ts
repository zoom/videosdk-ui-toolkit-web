export function isSupportWebCodecs() {
  return typeof (window as any).MediaStreamTrackProcessor === "function";
}
