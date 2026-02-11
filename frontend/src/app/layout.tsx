import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StoreProvider } from "@/components/providers/store-provider";
import "@/app/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Rower Ok",
  description: "Bicycle e-commerce store"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <StoreProvider>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
