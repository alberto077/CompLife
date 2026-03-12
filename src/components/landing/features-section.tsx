import { Card, CardContent } from "@/components/ui/card"
import { Zap, Trophy, GitBranch, Flame, Users, Target } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "XP System",
    description: "Earn experience points for every task completed. Watch your skills level up as you progress.",
    color: "text-primary",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description: "Unlock badges and trophies for milestones. Show off your accomplishments to the world.",
    color: "text-accent",
  },
  {
    icon: GitBranch,
    title: "Skill Trees",
    description: "Create custom skill trees for any area of your life. Unlock new abilities as you advance.",
    color: "text-primary",
  },
  {
    icon: Flame,
    title: "Daily Streaks",
    description: "Build momentum with daily streaks. Bonus XP multipliers reward consistency.",
    color: "text-accent",
  },
  {
    icon: Users,
    title: "Leaderboards",
    description: "Compete on the global leaderboard. Climb the ranks and prove your dedication.",
    color: "text-primary",
  },
  {
    icon: Target,
    title: "Integrations",
    description: "Sync GitHub commits, LeetCode problems, and more. Everything you do earns XP.",
    color: "text-accent",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Your <span className="text-primary">Quest</span> Awaits
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to gamify your self-improvement journey and stay motivated.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
