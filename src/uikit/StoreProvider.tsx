import { Provider } from "react-redux";
import { store } from "../store/store";
import { SessionApp } from "@/features/session-app";
import { CustomizationOptions } from "@/types";
import { SessionClient } from "@/types/index";
import { defaultConfig } from "@/constant/index";
import { deepMerge } from "./util";

interface StoreProviderProps {
  children: React.ReactNode;
  client: SessionClient;
  config: CustomizationOptions;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children, client, config }) => {
  const newConfig = deepMerge(defaultConfig, config);
  return (
    <Provider store={store}>
      <SessionApp client={client} config={newConfig}>
        {children}
      </SessionApp>
    </Provider>
  );
};

export { store };
