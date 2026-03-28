import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Alex Chen",
    title: "Software Developer",
    level: 67,
    content: "CompLife completely changed how I approach learning. I've leveled up my coding skills faster than ever before. The gamification makes it addictive in the best way.",
    avatar: "A",
  },
  {
    name: "Maria Santos",
    title: "Fitness Enthusiast",
    level: 45,
    content: "Finally found something that keeps me accountable! Seeing my fitness level go up after each workout is incredibly satisfying. I've been on a 90-day streak!",
    avatar: "M",
  },
  {
    name: "James Wilson",
    title: "Language Learner",
    level: 52,
    content: "I've tried every productivity app out there. CompLife is different because it tracks ALL my skills together. My character is now fluent in 3 languages.",
    avatar: "J",
  },
]

export function TestimonialsSection() {
  return (
    <section id="heroes" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Legendary <span className="text-accent">Heroes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of adventurers who have transformed their lives through gamified growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      {testimonial.title}
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-xs">
                        Lv. {testimonial.level}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
