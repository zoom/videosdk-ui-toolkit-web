import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import DemoHome from "./index";
import "../../index.css";
import "../../uikit/index.css";

const rootEle = document.getElementById("root");
if (rootEle) {
  ReactDOM.createRoot(rootEle).render(
    <Provider store={store}>
      <DemoHome />
    </Provider>,
  );
}
