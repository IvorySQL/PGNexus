import { getServerSession as getNextAuthSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";

/**
 * Get the current server session
 */
export async function getServerSession() {
  return await getNextAuthSession(authOptions);
}

/**
 * Require authentication for a route
 * Throws an error if user is not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession();

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  return session;
}

/**
 * Get the current user ID from session
 */
export async function getCurrentUserId(): Promise<number | null> {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return null;
  }

  return parseInt(session.user.id, 10);
}
