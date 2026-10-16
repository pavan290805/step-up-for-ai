import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./(frontend)/_context/AppProviders";

export const metadata: Metadata = {
  title: "Step-up for AI | Professional Hiring Platform",
  description: "Modern end-to-end hiring platform powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
