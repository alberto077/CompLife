import { NextAuthOptions, DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  debug: true,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          if (credentials.email === "demo@aura.com" && credentials.password === "demo") {
            // "Renew" the demo account by deleting it if it exists
            const existingUser = await prisma.user.findUnique({ where: { email: "demo@aura.com" } });
            if (existingUser) {
              await prisma.user.delete({ where: { email: "demo@aura.com" } });
            }
            
            // Create a fresh demo account
            const user = await prisma.user.create({
              data: {
                name: "Player One (Demo)",
                email: "demo@aura.com",
                level: 1,
                totalXP: 0,
                currentLevelXp: 0,
                xpToNextLevel: 200,
              }
            });
            
            return { id: user.id, name: user.name, email: user.email }
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || (!user.password && !user.emailVerified)) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password || "");
          if (!isValid) return null;

          return { id: user.id, name: user.name, email: user.email }
        } catch (error) {
          console.error("[AUTH] authorize error:", error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    }
  }
}
