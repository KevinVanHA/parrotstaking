import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";


const activeChain = "mumbai";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
    activeChain="mumbai"
    clientId="94da7d642c1c31c73a6c5c5753457476"
  >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
