import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expensify - Track, Analyze, and Master Your Finances",
  description: "A modern expense tracker with analytics and budget management powered by MongoDB",
  keywords: ["expense tracker", "budget management", "finance", "analytics", "mongodb"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
