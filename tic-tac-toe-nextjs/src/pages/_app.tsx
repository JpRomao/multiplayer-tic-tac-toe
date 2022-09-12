import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { NextIntlProvider } from "next-intl";
import io from "socket.io-client";

import { theme } from "../styles/theme";
import PlayerProvider from "../contexts/PlayerContext";
import SocketProvider from "../contexts/SocketContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <PlayerProvider>
        <NextIntlProvider messages={pageProps.messages}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </NextIntlProvider>
      </PlayerProvider>
    </SocketProvider>
  );
}
export default MyApp;
