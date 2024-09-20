import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import PageLayout from "./page_layout";
import AppProtector from "./app-protector";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vaishnavi Travel planner ",
  description: "The app is powered by Bright data",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppProtector/>
          <PageLayout>
            {children}
          </PageLayout>
        </Providers>
      </body>
    </html>
  );
}
