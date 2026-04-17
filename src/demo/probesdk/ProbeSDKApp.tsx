import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import ProbeSDKIndex from "./index";
import "../../i18n";
import "../../index.css";
import "../../components/theme/theme.css";
const rootEle = document.getElementById("root");
if (rootEle) {
  ReactDOM.createRoot(rootEle).render(
    <React.StrictMode>
      <Provider store={store}>
        <ProbeSDKIndex />
      </Provider>
    </React.StrictMode>,
  );
}
