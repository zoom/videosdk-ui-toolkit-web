import React, { useContext, useEffect, useRef, useState } from "react";
import { Prober, Reporter } from "@zoom/probesdk";

const ProbeContext = React.createContext({
  prober: null,
  reporter: null,
  isProbeSdkInitialized: false,
});

export const ProbeProvider = ({ children }) => {
  const [isProbeSdkInitialized, setIsProbeSdkInitialized] = useState(false);

  const proberRef = useRef(null);
  const reporterRef = useRef(null);

  useEffect(() => {
    const prober = new Prober();
    const reporter = new Reporter();

    proberRef.current = prober;
    reporterRef.current = reporter;
    setIsProbeSdkInitialized(true);
  }, []);

  return (
    <ProbeContext.Provider value={{ prober: proberRef.current, reporter: reporterRef.current, isProbeSdkInitialized }}>
      {children}
    </ProbeContext.Provider>
  );
};

export const useProbe = () => {
  return useContext(ProbeContext);
};
