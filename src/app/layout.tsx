import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavbarAuth } from "@/components/NavbarAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura | Advanced Skill Tracker",
  description: "Gamify your life, track your skills, and synchronize your tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-50 antialiased selection:bg-indigo-500/30`}>
        {/* Global Background Elements */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px]" />
        </div>
        
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-neutral-950/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="font-bold text-white text-lg">A</span>
              </div>
              <span className="font-bold text-lg tracking-tight">Aura</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
              <a href="/#features" className="hover:text-white transition-colors">Features</a>
              <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
              <a href="/#integrations" className="hover:text-white transition-colors">Integrations</a>
            </div>
            <NavbarAuth />
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
