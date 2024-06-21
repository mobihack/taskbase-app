import { AuthProvider } from "@/context/useAuth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <main
        className={`flex flex-col items-center justify-between ${inter.className}`}
      >
        <div className="md:max-w-4xl max-w-lg w-full px-4">
          <Component {...pageProps} />
          <Toaster />
        </div>
      </main>
    </AuthProvider>
  );
}
