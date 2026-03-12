"use client"

import { Button } from "@/components/ui/button"
import { Sword, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function CTASection() {
  const router = useRouter()

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          {/* Background glow */}
          <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl" />
          
          <div className="relative bg-card border border-border rounded-2xl p-12 md:p-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-primary">Begin</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Your epic journey awaits. Create your character today and start leveling up 
              the skills that matter most to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push("/register")}>
                <Sword className="w-5 h-5 mr-2" />
                Start Your Adventure
              </Button>
              <Button size="lg" variant="ghost" className="text-lg px-8 py-6 group" onClick={() => router.push("/dashboard")}>
                Learn More
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required. Free forever for basic features.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
