import type { FC } from 'react';

import type { Portfolio } from '@/interfaces/features/portfolios';
import { getPortfolioById } from '@/services/portfolios';
import PortfolioForm from './_components/PortfolioForm';

type Props = {
  params: Promise<{ name: string }>;
};

const PortfolioDetailCMS: FC<Props> = async ({ params }: { params: Promise<{ name: string }> }) => {
  const { name } = await params;
  const isEdit = name !== 'new';

  let initialData: Portfolio | null = null;

  if (isEdit) {
    const result = await getPortfolioById(name);
    if (result.success && result.data) {
      initialData = result.data as Portfolio;
    }
  }

  return <PortfolioForm initialData={initialData} />;
};

export default PortfolioDetailCMS;
