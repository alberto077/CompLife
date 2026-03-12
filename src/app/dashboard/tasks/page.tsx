import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TasksClient from "./TasksClient";

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const [skills, tasks] = await Promise.all([
    prisma.skill.findMany({
      where: { userId: session.user.id },
      orderBy: { name: 'asc' }
    }),
    prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { completed: 'asc' },
        { createdAt: 'desc' }
      ]
    })
  ]);

  return <TasksClient initialSkills={skills} initialTasks={tasks} />;
}
