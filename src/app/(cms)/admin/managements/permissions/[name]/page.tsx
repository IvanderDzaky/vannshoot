import type { FC } from 'react';

import type { Permission } from '@/interfaces/features/permissions';
import { getPermissionByName } from '@/services/permissions';
import PermissionForm from './_components/PermissionForm';

type Props = {
  params: Promise<{ name: string }>;
};

const PermissionsDetailCMS: FC<Props> = async ({ params }) => {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const isEdit = decodedName !== 'new';

  let initialData: Permission | null = null;

  if (isEdit) {
    const result = await getPermissionByName(decodedName);
    if (result.success && result.data) {
      initialData = result.data as Permission;
    }
  }

  return <PermissionForm initialData={initialData} />;
};

export default PermissionsDetailCMS;
