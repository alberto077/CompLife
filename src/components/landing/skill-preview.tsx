"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Dumbbell, BookOpen, Music, Palette, Brain } from "lucide-react"

const skills = [
  { name: "Coding", level: 24, xp: 2400, maxXp: 3000, icon: Code, color: "bg-primary" },
  { name: "Fitness", level: 18, xp: 1800, maxXp: 2500, icon: Dumbbell, color: "bg-accent" },
  { name: "Reading", level: 31, xp: 800, maxXp: 1000, icon: BookOpen, color: "bg-primary" },
  { name: "Music", level: 12, xp: 600, maxXp: 1500, icon: Music, color: "bg-accent" },
  { name: "Art", level: 8, xp: 400, maxXp: 1000, icon: Palette, color: "bg-primary" },
  { name: "Languages", level: 15, xp: 1200, maxXp: 2000, icon: Brain, color: "bg-accent" },
]

function SkillBar({ skill }: { skill: typeof skills[0] }) {
  const percentage = (skill.xp / skill.maxXp) * 100

  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
        <skill.icon className="w-5 h-5 text-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">{skill.name}</span>
          <span className="text-sm text-muted-foreground">Lv. {skill.level}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full ${skill.color} rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {skill.xp.toLocaleString()} / {skill.maxXp.toLocaleString()} XP
        </div>
      </div>
    </div>
  )
}

export function SkillPreview() {
  return (
    <section id="skills" className="py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Your <span className="text-primary">Character</span> Sheet
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Track every skill you want to develop. Watch your progress in real-time 
              as you complete quests and earn experience.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Create unlimited custom skills
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Set your own XP values for activities
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Track progress with beautiful visualizations
              </li>
            </ul>
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Hero Profile</CardTitle>
                <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  Level 42
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Total XP: 127,450</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
