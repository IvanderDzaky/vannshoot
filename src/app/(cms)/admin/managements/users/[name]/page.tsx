import type { FC } from 'react';
import { notFound } from 'next/navigation';

import type { User } from '@/interfaces/features/users';
import { getUserById } from '@/services/users';
import UserForm from './_components/UserForm';

type Props = {
  params: Promise<{ name: string }>;
};

const UserDetailCMS: FC<Props> = async ({ params }) => {
  const { name } = await params;
  const isEdit = name !== 'new';

  let initialData: User | null = null;

  if (isEdit) {
    const result = await getUserById(name);
    if (result.success && result.data) {
      initialData = result.data as User;
    } else {
      return notFound();
    }
  }

  return <UserForm initialData={initialData} />;
};

export default UserDetailCMS;
