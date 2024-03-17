import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";


const activeChain = "mumbai";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
    activeChain="mumbai"
    clientId="728a8ba599fb4aa43865a0eb03d9c318"
  >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
