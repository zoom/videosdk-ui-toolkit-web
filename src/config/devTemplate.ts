import { getExploreName } from "@/components/util/platform";
let devConfig = {
  sdkKey: "",
  sdkSecret: "",
  webEndpoint: "zoom.us",
};

const commonConfig = {
  topic: "topic",
  name: getExploreName(),
  password: "",
  signature: "",
  sessionKey: "",
  userIdentity: "",
  role: 1,
  enforceAB: 0,
  enforceWebrtc: 0,
};

const urlArgs: any = Object.fromEntries(new URLSearchParams(location.search));

devConfig = { ...commonConfig, ...devConfig };
console.log({ devConfig });
export { devConfig };
export default devConfig;
