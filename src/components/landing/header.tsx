"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Gamepad2, Menu, X } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Skills", href: "#skills" },
  { name: "Heroes", href: "#heroes" },
  { name: "Dashboard", href: "/dashboard" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-lg">C</span>
            </div>
            <span className="font-bold text-xl">CompLife</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                <Button variant="ghost" onClick={() => router.push("/dashboard")}>Dashboard</Button>
                <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>Log Out</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => signIn()}>Log In</Button>
                <Button onClick={() => router.push("/register")}>Sign Up Free</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {session ? (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => router.push("/dashboard")}>Dashboard</Button>
                    <Button variant="destructive" className="justify-start" onClick={() => signOut({ callbackUrl: "/" })}>Log Out</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => signIn()}>Log In</Button>
                    <Button className="justify-start" onClick={() => router.push("/register")}>Sign Up Free</Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
