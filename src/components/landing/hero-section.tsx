"use client"

import { Button } from "@/components/ui/button"
import { Sword, Shield, Sparkles } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">Your adventure begins here</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
          <span className="text-foreground">Level Up</span>
          <br />
          <span className="text-primary">Your Real Life</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Transform your personal development into an epic RPG adventure. Track skills, earn XP, 
          unlock achievements, and become the hero of your own story.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push("/register")}>
            <Sword className="w-5 h-5 mr-2" />
            Create Your Character
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => signIn("credentials", { email: "demo@aura.com", password: "demo", callbackUrl: "/dashboard" })}>
            <Shield className="w-5 h-5 mr-2" />
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">50K+</div>
            <div className="text-sm text-muted-foreground">Active Heroes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent">2M+</div>
            <div className="text-sm text-muted-foreground">XP Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">100K+</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </div>
        </div>
      </div>
    </section>
  )
}
