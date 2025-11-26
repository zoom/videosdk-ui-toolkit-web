import React from "react";
import { SessionClient } from "../types/index.d";

export const ClientContext = React.createContext<SessionClient>(null as SessionClient);
