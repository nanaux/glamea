import type { Metadata } from "next";
import { Inter, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GLAMÉA - Marketplace MUA Padang",
  description: "Temukan Makeup Artist terbaik di Padang yang sesuai dengan kebutuhan, gaya makeup, dan budget kamu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-sans min-h-screen text-glamea-text bg-glamea-background bg-glamea-bg-pattern bg-blend-soft-light`}>
        {children}
      </body>
    </html>
  );
}
