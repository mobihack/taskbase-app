import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`flex flex-col items-center justify-between ${inter.className}`}
    >
      <div className="max-w-3xl w-full px-4">
        <Component {...pageProps} />
      </div>
    </main>
  );
}
