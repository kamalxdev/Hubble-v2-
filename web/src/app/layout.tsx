import type { Metadata } from "next";
import localFont from "next/font/local";
import { Provider } from "@/components/ui/provider";
import "./globals.css";
import { startRedis } from "@/utils/redis";
import { Toaster } from "@/components/ui/toaster";
import StoreProvider from "./StoreProvider";
import { PeerContextProvider } from "@/context/peers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Hubble",
  description: "A messaging website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await startRedis();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <PeerContextProvider>
            <Provider>
              <Toaster />
              {children}
            </Provider>
          </PeerContextProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
