import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SkillsClient from "./SkillsClient";

export default async function SkillsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const skills = await prisma.skill.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return <SkillsClient initialSkills={skills} />;
}
