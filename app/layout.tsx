import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnlySA — For SA Eyes Only",
  description: "Anonymous confessions, city rants, reviews, and hot takes from across South Africa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        style={{ backgroundColor:"#0A0A0A", color:"#FFFFFF", margin:0, padding:0 }}
      >
        {children}
      </body>
    </html>
  );
}
