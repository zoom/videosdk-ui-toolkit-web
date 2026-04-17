/* eslint-disable no-console */
import { getExploreName } from "@/components/util/platform";
let devConfig = {
  sdkKey: "",
  sdkSecret: "",
  webEndpoint: "deva.zoomdev.us",
};

// only have audio and video. no additional plan
const devaConfig = {
  sdkKey: "",
  sdkSecret: "",
  webEndpoint: "deva.zoomdev.us",
};

const prodConfig = {
  sdkKey: "",
  sdkSecret: "",
  webEndpoint: "zoom.us",
};

const goConfig = {
  sdkKey: "",
  sdkSecret: "",
  webEndpoint: "zoom.us",
};

const commonConfig = {
  topic: "topic",
  name: getExploreName(),
  password: "123456",
  signature: "",
  sessionKey: "",
  userIdentity: "",
  role: 1,
  enforceAB: 1,
  enforceWebrtc: 1,
};

const urlArgs: any = Object.fromEntries(new URLSearchParams(location.search));

if (urlArgs.env === "dev") {
  devConfig = { ...commonConfig, ...devConfig };
} else if (urlArgs.env === "deva") {
  devConfig = { ...commonConfig, ...devaConfig };
} else if (urlArgs.env === "prod") {
  devConfig = { ...commonConfig, ...prodConfig };
} else if (urlArgs.env === "go") {
  devConfig = { ...commonConfig, ...goConfig };
} else {
  devConfig = { ...commonConfig, ...devConfig };
}

console.log({ devConfig });
export { devConfig };
export default devConfig;
