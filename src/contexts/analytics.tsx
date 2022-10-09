import splitbee from "@splitbee/web";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";

const AnalyticsContext = createContext<
  { track: (event: string, data?: any) => void } | undefined
>(undefined);

type AnalyticsProviderProps = {
  children: ReactNode;
};

const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  useEffect(() => {
    if (process.env.VERCEL_ENV === "production") {
      splitbee.init();
    }
  }, []);

  const log = useCallback((event: string, data?: any) => {
    if (process.env.VERCEL_ENV === "production") {
      splitbee.track(event, data);
    } else {
      console.log({ event, data });
    }
  }, []);

  const track = useCallback(
    (event: string, data?: any) => {
      log(event, data);
    },
    [log]
  );

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

function useAnalytics() {
  const context = useContext(AnalyticsContext);

  if (context === undefined) {
    throw new Error("useAnalytics must be used within a AnalyticsProvider");
  }

  return context;
}

export { AnalyticsProvider, useAnalytics };
