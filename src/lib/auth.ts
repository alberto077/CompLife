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

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        username: { label: "Username (type 'demo')", type: "text", placeholder: "demo" },
        password: { label: "Password (type 'demo')", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === "demo" && credentials?.password === "demo") {
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
        return null
      }
    }),
  ],
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
