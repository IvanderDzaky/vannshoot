'use server';

import { prisma } from '@/lib/prisma';

/**
 * Mengambil data kategori portfolio untuk ditampilkan di frontend (tanpa permission check)
 */
export async function getPublicPortfolioCategories(limit?: number) {
  try {
    const data = await prisma.portfolioCategory.findMany({
      orderBy: { createdAt: 'asc' },
      ...(typeof limit === 'number' ? { take: limit } : {}),
    });
    return data;
  } catch (error) {
    console.error('Get Public Portfolio Categories Error:', error);
    return [];
  }
}

/**
 * Mengambil data portfolio terbaru untuk ditampilkan di frontend
 */
export async function getPublicPortfolios(limit: number = 8) {
  try {
    const categories = await prisma.portfolioCategory.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        portfolios: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            categories: true,
            images: true,
          },
        },
      },
    });

    const portfoliosMap = new Map<string, any>();
    for (const cat of categories) {
      if (cat.portfolios && cat.portfolios.length > 0) {
        const portfolio = cat.portfolios[0];
        portfoliosMap.set(portfolio.id, portfolio);
      }
    }

    let uniquePortfolios = Array.from(portfoliosMap.values());

    if (uniquePortfolios.length < limit) {
      const existingIds = uniquePortfolios.map((p) => p.id);
      const fallbackPortfolios = await prisma.portfolio.findMany({
        where: {
          id: { notIn: existingIds },
        },
        orderBy: { createdAt: 'desc' },
        take: limit - uniquePortfolios.length,
        include: {
          categories: true,
          images: true,
        },
      });
      uniquePortfolios = [...uniquePortfolios, ...fallbackPortfolios];
    }

    const mappedPortfolios = uniquePortfolios.map((portfolio) => ({
      ...portfolio,
      images: portfolio.images ? portfolio.images.map((img: any) => img.image) : [],
    }));

    return mappedPortfolios.slice(0, limit);
  } catch (error) {
    console.error('Get Public Portfolios Error:', error);
    return [];
  }
}

/**
 * Mengambil 1 portfolio terbaru dari setiap kategori
 */
export async function getLatestPortfoliosPerCategory() {
  try {
    const categories = await prisma.portfolioCategory.findMany();
    const portfolios = await Promise.all(
      categories.map(async (category) => {
        const p = await prisma.portfolio.findFirst({
          where: {
            categories: {
              some: { id: category.id },
            },
          },
          orderBy: { createdAt: 'desc' },
          include: { categories: true, images: true },
        });

        if (p) {
          // Reorder categories so the one that triggered this fetch is first
          const otherCategories = p.categories.filter((c) => c.id !== category.id);
          return {
            ...p,
            categories: [category, ...otherCategories],
            images: p.images ? p.images.map((img) => img.image) : [],
          };
        }
        return null;
      })
    );

    const resultPortfolios = [];
    for (const p of portfolios) {
      if (p) {
        resultPortfolios.push(p);
      }
    }

    // Sort by createdAt desc globally
    resultPortfolios.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return resultPortfolios;
  } catch (error) {
    console.error('Get Latest Portfolios Per Category Error:', error);
    return [];
  }
}

/**
 * Mengambil data detail portfolio berdasarkan ID
 */
export async function getPublicPortfolioById(id: string) {
  try {
    const data = await prisma.portfolio.findUnique({
      where: { id },
      include: {
        categories: true,
        images: true,
      },
    });
    if (!data) return null;
    return {
      ...data,
      images: data.images ? data.images.map((img) => img.image) : [],
    };
  } catch (error) {
    console.error('Get Public Portfolio By ID Error:', error);
    return null;
  }
}

/**
 * Mengkonversi string title menjadi URL-friendly slug
 */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Mengambil data detail portfolio berdasarkan slug dari title
 */
export async function getPublicPortfolioBySlug(titleSlug: string) {
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: { categories: true, images: true },
    });
    const found = portfolios.find((p) => toSlug(p.title) === titleSlug);
    if (!found) return null;
    return {
      ...found,
      images: found.images ? found.images.map((img) => img.image) : [],
    };
  } catch (error) {
    console.error('Get Public Portfolio By Slug Error:', error);
    return null;
  }
}

/**
 * Mengambil data detail kategori portfolio berdasarkan slug dari title
 */
export async function getPublicPortfolioCategoryBySlug(titleSlug: string) {
  try {
    const categories = await prisma.portfolioCategory.findMany();
    return categories.find((c) => toSlug(c.title) === titleSlug) ?? null;
  } catch (error) {
    console.error('Get Public Portfolio Category By Slug Error:', error);
    return null;
  }
}

/**
 * Mengambil seluruh data portfolio, dengan filter opsional berdasarkan kategori
 */
export async function getAllPublicPortfolios(categoryId?: string, city?: string) {
  try {
    const whereClause: any = {};
    if (categoryId) {
      whereClause.categories = { some: { id: categoryId } };
    }
    if (city) {
      whereClause.city = { equals: city, mode: 'insensitive' };
    }

    const data = await prisma.portfolio.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
        images: true,
      },
    });
    return data.map((portfolio) => ({
      ...portfolio,
      images: portfolio.images ? portfolio.images.map((img) => img.image) : [],
    }));
  } catch (error) {
    console.error('Get All Public Portfolios Error:', error);
    return [];
  }
}

/**
 * Mengambil seluruh data portfolio dan mengelompokkannya berdasarkan city
 */
export async function getPublicPortfoliosGroupedByCity() {
  try {
    const data = await prisma.portfolio.findMany({
      where: { city: { not: '' } }, // asumsikan city tidak kosong jika diset
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
      },
    });

    const grouped = data.reduce(
      (acc, portfolio) => {
        const city = portfolio.city;
        if (!city) return acc;

        const cityLower = city.toLowerCase();
        if (!acc[cityLower]) {
          acc[cityLower] = {
            city: city, // original casing
            firstPortfolio: portfolio,
            portfolios: [],
          };
        }
        acc[cityLower].portfolios.push(portfolio);
        return acc;
      },
      {} as Record<string, any>
    );

    return Object.values(grouped);
  } catch (error) {
    console.error('Get Grouped Portfolios By City Error:', error);
    return [];
  }
}

/**
 * Mengambil data klien untuk carousel di frontend
 */
export async function getPublicClients() {
  try {
    const data = await prisma.client.findMany({
      orderBy: { createdAt: 'asc' },
      include: { categories: true },
    });
    return data;
  } catch (error) {
    console.error('Get Public Clients Error:', error);
    return [];
  }
}

/**
 * Mengambil daftar kota unik dari testimoni
 */
export async function getPublicCities() {
  try {
    const data = await prisma.testimonial.findMany({
      select: { city: true },
      distinct: ['city'],
      where: { city: { not: '' } },
    });
    return data.map((t) => t.city).filter(Boolean);
  } catch (error) {
    console.error('Get Public Cities Error:', error);
    return [];
  }
}

/**
 * Mengambil data testimoni untuk ditampilkan di frontend
 */
export async function getPublicTestimonials() {
  try {
    const data = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return data;
  } catch (error) {
    console.error('Get Public Testimonials Error:', error);
    return [];
  }
}

/*
export async function getPublicArticleCategories() {
  try {
    const data = await prisma.articleCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return data;
  } catch (error) {
    console.error('Get Public Article Categories Error:', error);
    return [];
  }
}

export async function getPublicArticles(categoryId?: string) {
  try {
    const data = await prisma.article.findMany({
      where: categoryId
        ? {
            articleCategories: {
              some: { id: categoryId },
            },
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        articleCategories: true,
        createdBy: {
          select: { id: true, name: true, image: true },
        },
      },
    });
    return data;
  } catch (error) {
    console.error('Get Public Articles Error:', error);
    return [];
  }
}

export async function getPublicArticleBySlug(titleSlug: string) {
  try {
    const articles = await prisma.article.findMany({
      include: {
        articleCategories: true,
        createdBy: {
          select: { id: true, name: true, image: true },
        },
      },
    });
    return articles.find((a) => toSlug(a.title) === titleSlug) ?? null;
  } catch (error) {
    console.error('Get Public Article By Slug Error:', error);
    return null;
  }
}

export async function getPublicYoutubeLinks() {
  try {
    const data = await prisma.youtubeLink.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return data;
  } catch (error) {
    console.error('Get Public Youtube Links Error:', error);
    return [];
  }
}
*/
