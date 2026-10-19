import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import PopupProvider from "./context/popup/provider";
import AuthProvider from "./context/auth/provider";
import type { Metadata } from "next";
import {Petrona, Alegreya_Sans } from "next/font/google";
import "./globals.css";
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import TooltipProvider from "./context/tooltip/provider";
config.autoAddCss = false

const petrona = Petrona({
  variable: "--font-petrona",
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '700'],
});

const alegreya = Alegreya_Sans({
  variable: "--font-alegreya",
  subsets: ["latin"],
  weight: "300"
});

export const metadata: Metadata = {
  title: "Petfolio",
  description: "Create your pet's portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${petrona.variable} ${alegreya.variable}`}>
        <AuthProvider>
          <Header />
            <PopupProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </PopupProvider>
          <Footer />
        </AuthProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}