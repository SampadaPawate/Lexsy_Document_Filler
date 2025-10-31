import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lexsy Document Filler - AI-Powered Legal Document Automation",
  description: "Automate your legal document completion with AI. Upload, fill, and download completed SAFE agreements in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
