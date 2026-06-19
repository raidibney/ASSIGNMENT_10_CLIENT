import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TicketBari - Travel Smart",
  description: "Bangladesh's Smart Ticket Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      /* CRITICAL FIX: This tells Next.js 16+ that next-themes will safely modify attributes here */
      suppressHydrationWarning 
    >
      <body >
        <ThemeProvider>
          <Navbar />
          <main >
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}