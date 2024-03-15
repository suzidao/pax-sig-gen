/** @format */

import type { Metadata } from "next";
import Roboto from "next/font/local";
import "./globals.css";
import { MyBadgesContextProvider } from "./contexts";

const roboto = Roboto({
  src: [
    {
      path: "./Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Roboto-Medium.ttf",
      weight: "500",
      style: "medium",
    },
    {
      path: "./Roboto-Bold.ttf",
      weight: "700",
      style: "bold",
    },
  ],
});

export const metadata: Metadata = {
  title: "PAX Forum Signature Generator",
  description: "For all your PAX forum needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"bg-gray-100 " + roboto.className}>
        <MyBadgesContextProvider>{children}</MyBadgesContextProvider>
      </body>
    </html>
  );
}
