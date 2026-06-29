import type { FC } from 'react';

import type { Role } from '@/interfaces/features/roles';
import { getRoleById } from '@/services/roles';
import RoleForm from './_components/RoleForm';

type Props = {
  params: Promise<{ name: string }>;
};

const RolesDetailCMS: FC<Props> = async ({ params }) => {
  const { name } = await params;
  const isEdit = name !== 'new';

  let initialData: Role | null = null;

  if (isEdit) {
    const result = await getRoleById(name);
    if (result.success && result.data) {
      initialData = result.data as Role;
    }
  }

  return <RoleForm initialData={initialData} />;
};

export default RolesDetailCMS;
