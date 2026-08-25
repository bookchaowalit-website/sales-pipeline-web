import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deal Desk — Sales Pipeline",
  description: "A focused opportunity register for reading the deal and moving one step.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
