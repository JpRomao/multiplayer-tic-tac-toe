import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../styles/theme";
import { NextIntlProvider } from "next-intl";
import PlayerProvider from "../contexts/PlayerContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerProvider>
      <NextIntlProvider messages={pageProps.messages}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </NextIntlProvider>
    </PlayerProvider>
  );
}
export default MyApp;
