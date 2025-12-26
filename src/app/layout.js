import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistPoppins = Geist({
  variable: "--font-geist-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMontserrat = Geist({
  variable: "--font-geist-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stack Builder Pro",
  description: "Design, save, and manage your tech stacks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistMontserrat.variable} ${geistPoppins.variable} antialiased`}
      >
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
