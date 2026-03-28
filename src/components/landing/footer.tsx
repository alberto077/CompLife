export function Footer() {
  const footerLinks = {
    Product: ["Features", "Roadmap", "Changelog"],
    Community: ["Leaderboards", "Discord", "Events"],
    Resources: ["Blog", "Guides", "Support"],
    Company: ["About", "Careers", "Contact"],
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-bold text-primary-foreground text-lg">C</span>
              </div>
              <span className="font-bold text-xl">CompLife</span>
            </a>
            <p className="text-sm text-muted-foreground">
              Level up your real life with gamified personal development.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            2026 CompLife. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
