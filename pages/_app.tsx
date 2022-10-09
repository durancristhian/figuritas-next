import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AnalyticsProvider } from "../src/contexts/analytics";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Crea tu álbum de figuritas del mundial personalizado.</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <AnalyticsProvider>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
            focusRing: "always",
            fontFamily: `"Montserrat", serif !important`,
          }}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </AnalyticsProvider>
    </>
  );
}

export default MyApp;
