import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Group Chat - Professional Communication Platform",
  description: "Secure and professional group chat application for modern teams",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <Navigation />
          <main style={{ paddingTop: '60px' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
