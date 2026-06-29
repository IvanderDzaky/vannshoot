import type { FC } from 'react';

import type { Article } from '@/interfaces/features/articles';
import { getArticleById } from '@/services/articles';
import ArticleForm from './_components/ArticleForm';

type Props = {
  params: Promise<{ name: string }>;
};

const ArticleDetailCMS: FC<Props> = async ({ params }) => {
  const { name } = await params;
  const isEdit = name !== 'new';

  let initialData: Article | null = null;

  if (isEdit) {
    const result = await getArticleById(name);
    if (result.success && result.data) {
      initialData = result.data as Article;
    }
  }

  return <ArticleForm initialData={initialData} />;
};

export default ArticleDetailCMS;
