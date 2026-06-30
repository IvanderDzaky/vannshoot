'use server';
import { prisma } from '@/lib/prisma';

/**
 * Cleanup all references to specific media URLs in the database.
 * This is called when media is permanently deleted from the Library.
 */
export async function cleanupMediaReferences(urls: string[]) {
  if (urls.length === 0) return;

  try {
    for (const url of urls) {
      // Create conditions to catch both exact file match and file inside a deleted folder
      const whereCondition = {
        OR: [{ image: url }, { image: { startsWith: url.endsWith('/') ? url : `${url}/` } }],
      };

      // 1. Cleanup Clients
      await prisma.client.updateMany({
        where: whereCondition,
        data: { image: null },
      });

      // 2. Cleanup Users
      await prisma.user.updateMany({
        where: whereCondition,
        data: { image: null },
      });
    }

    console.log(
      `[Cleanup] Successfully processed ${urls.length} deletion triggers for DB references.`
    );
  } catch (error) {
    console.error('[Cleanup] Failed to cleanup media references:', error);
  }
}
