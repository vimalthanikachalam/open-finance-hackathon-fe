import ConsentModal from "@/components/ConsentModal";
import FloatingMenu from "@/components/Misc/FloatingMenu";
import Header from "@/components/Misc/Header";
import SessionInitializer from "@/components/SessionInitializer";
import { Toaster } from "@/components/ui/toaster";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <SessionInitializer />
        <ConsentModal />
        <Toaster />
        {/* Navigation */}
        <Header />
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 pb-24">
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {children}
          </main>
        </div>
        {/* Floating Menu */}
        <FloatingMenu />
      </body>
    </html>
  );
}
