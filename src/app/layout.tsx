import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeFlow — Music in Motion",
  description:
    "A different way to experience your music. A little nostalgia. A whole new vibe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
