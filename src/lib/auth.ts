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

        if (credentials.email === "demo@aura.com" && credentials.password === "demo") {
          let user = await prisma.user.findUnique({ where: { email: "demo@aura.com" } })
          if (!user) {
            user = await prisma.user.create({
              data: {
                name: "Player One (Demo)",
                email: "demo@aura.com",
                level: 4,
                totalXP: 570,
              }
            })
          }
          return { id: user.id, name: user.name, email: user.email }
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || (!user.password && !user.emailVerified)) {
          return null; // No user found or user created via OAuth with no password
        }

        const isValid = await bcrypt.compare(credentials.password, user.password || "");
        if (!isValid) return null;

        return { id: user.id, name: user.name, email: user.email }
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
