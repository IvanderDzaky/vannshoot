import type { FC } from 'react';

import type { PortfolioCategory } from '@/interfaces/features/portfolio-categories';
import { getPortfolioCategoryById } from '@/services/portfolio-categories';
import PortfolioCategoryForm from './_components/PortfolioCategoryForm';

type Props = {
  params: Promise<{ name: string }>;
};

const PortfolioCategoryDetailCMS: FC<Props> = async ({ params }) => {
  const { name } = await params;
  const isEdit = name !== 'new';

  let initialData: PortfolioCategory | null = null;

  if (isEdit) {
    const result = await getPortfolioCategoryById(name);
    if (result.success && result.data) {
      initialData = result.data as PortfolioCategory;
    }
  }

  return <PortfolioCategoryForm initialData={initialData} />;
};

export default PortfolioCategoryDetailCMS;
