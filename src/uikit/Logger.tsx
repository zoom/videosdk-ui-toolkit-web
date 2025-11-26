/* eslint-disable no-console */
export const Logger = {
  info: (message, ...args) => {
    console.log(`%c[INFO] %c${message}`, "color: #007AFF; font-weight: bold;", "color: inherit;", ...args);
  },
  event: (message, ...args) => {
    console.log(
      `%c[eventListener] %c${message}`,
      "color:rgb(255, 179, 0); font-weight: bold;",
      "color: inherit;",
      ...args,
    );
  },
  warn: (message, ...args) => {
    console.warn(`%c[WARN] %c${message}`, "color: #FF9500; font-weight: bold;", "color: inherit;", ...args);
  },
  error: (message, ...args) => {
    console.error(`%c[ERROR] %c${message}`, "color: #FF3B30; font-weight: bold;", "color: inherit;", ...args);
  },
  success: (message, ...args) => {
    console.log(`%c[SUCCESS] %c${message}`, "color: #34C759; font-weight: bold;", "color: inherit;", ...args);
  },
  json: (label, data) => {
    console.log(`%c[JSON] %c${label}`, "color: #5856D6; font-weight: bold;", "color: inherit;");
    try {
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.log(data);
    }
  },
};
