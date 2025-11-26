import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import HomeApp from "./index";

const rootEle = document.getElementById("root");
if (rootEle) {
  ReactDOM.createRoot(rootEle).render(
    <React.StrictMode>
      <Provider store={store}>
        <HomeApp />
      </Provider>
    </React.StrictMode>,
  );
}
