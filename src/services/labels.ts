'use server';

import { prisma } from '@/lib/prisma';

export type LabelType =
  | 'portfolio-categories'
  | 'clients'
  | 'articles'
  | 'youtube-links'
  | 'users'
  | 'roles'
  | 'testimonials';

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

/**
 * Resolves a label for a given ID or Name based on the segment type
 */
export async function resolveLabel(segment: string, type: string): Promise<string | null> {
  const decodedSegment = decodeURIComponent(segment);
  try {
    if (type === 'youtube-links') {
      const link = await prisma.youtubeLink.findUnique({
        where: { id: decodedSegment },
        select: { title: true },
      });
      return link?.title || null;
    }

    if (type === 'portfolio-categories') {
      const category = await prisma.portfolioCategory.findUnique({
        where: { id: decodedSegment },
        select: { title: true },
      });
      return category?.title || null;
    }

    if (type === 'clients') {
      // Jika UUID → cari by ID dulu
      if (isUUID(decodedSegment)) {
        const clientById = await prisma.client.findUnique({
          where: { id: decodedSegment },
          select: { name: true },
        });
        if (clientById) return clientById.name;
      }

      // Fallback: cari by name (slug)
      const clientByName = await prisma.client.findFirst({
        where: { name: decodedSegment },
        select: { name: true },
      });
      return clientByName?.name || null;
    }

    if (type === 'portfolio') {
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: decodedSegment },
        select: { title: true },
      });
      return portfolio?.title || null;
    }

    if (type === 'articles') {
      // Jika UUID → cari by ID dulu
      if (isUUID(decodedSegment)) {
        const articleById = await prisma.article.findUnique({
          where: { id: decodedSegment },
          select: { title: true },
        });
        if (articleById) return articleById.title;
      }

      // Fallback: cari by title
      const articleByTitle = await prisma.article.findFirst({
        where: { title: decodedSegment },
        select: { title: true },
      });
      return articleByTitle?.title || null;
    }

    if (type === 'testimonials') {
      const testimonial = await prisma.testimonial.findUnique({
        where: { id: decodedSegment },
        select: { client: true },
      });
      return testimonial?.client || null;
    }

    if (type === 'users') {
      const user = await prisma.user.findUnique({
        where: { id: decodedSegment },
        select: { name: true },
      });
      return user?.name || null;
    }

    if (type === 'roles') {
      // Jika UUID → cari by ID
      if (isUUID(decodedSegment)) {
        const roleById = await prisma.role.findUnique({
          where: { id: decodedSegment },
          select: { name: true },
        });
        if (roleById) return roleById.name;
      }

      // Fallback: cari by name
      const roleByName = await prisma.role.findFirst({
        where: { name: decodedSegment },
        select: { name: true },
      });
      return roleByName?.name || null;
    }

    return null;
  } catch (error) {
    console.error('Resolve Label Error:', error);
    return null;
  }
}
