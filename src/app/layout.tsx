import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer"
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ['italic', 'normal'],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Hotel Management App",
  description: "Discover the best hotel rooms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={`${montserrat.className} antialiased`}>
        <main className="font-normal">
          <ThemeProvider>
            <Header />
            {children}
            <Footer />
          </ThemeProvider>

        </main>
        
      </body>
    </html>
  );
}
