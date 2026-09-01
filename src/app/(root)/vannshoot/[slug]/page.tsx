import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicPortfolioBySlug } from '@/services/public';
import { getPublicOrderSetting } from '@/services/order-settings';
import { VannShootDetailView } from '../_components/VannShootDetailView';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPublicPortfolioBySlug(slug);
  if (!portfolio) return { title: 'Foto Tidak Ditemukan - VannShoot' };

  return {
    title: `${portfolio.title} - VannShoot Katalog`,
    description: portfolio.description || `Koleksi foto ${portfolio.title} dari studio VannShoot.`,
    openGraph: {
      title: portfolio.title,
      description: portfolio.description || undefined,
      images: portfolio.cover ? [{ url: portfolio.cover }] : [],
    },
  };
}

export default async function VannShootDetailPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPublicPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  // Ambil order setting publik untuk menghitung biaya layanan jika ada
  const settingResult = await getPublicOrderSetting();
  let serviceFee = 0;
  if (settingResult?.success && settingResult.data?.serviceCharge && settingResult.data.value) {
    if (settingResult.data.serviceType === 'PERCENTAGE' && portfolio.price) {
      serviceFee = (portfolio.price * settingResult.data.value) / 100;
    } else {
      serviceFee = settingResult.data.value;
    }
  }

  return (
    <VannShootDetailView
      portfolio={{
        id: portfolio.id,
        title: portfolio.title,
        description: portfolio.description,
        cover: portfolio.cover,
        images: portfolio.images || [],
        city: portfolio.city,
        location: portfolio.location,
        price: portfolio.price,
        categories: portfolio.categories.map((c) => ({ id: c.id, title: c.title })),
      }}
      serviceFee={serviceFee}
    />
  );
}
