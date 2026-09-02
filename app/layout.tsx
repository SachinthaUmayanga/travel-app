import type { Metadata } from "next";
import {Poppins} from 'next/font/google';
import "./globals.css";
import AuthProvider from "@/components/Helper/AuthProvider";

const font = Poppins ({
  weight: ['100','200','300','400','500','600','700','800','900'],
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: "Travel",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
