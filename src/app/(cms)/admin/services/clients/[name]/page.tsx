import type { FC } from 'react';

import type { Client } from '@/interfaces/features/clients';
import { getClientById } from '@/services/clients';
import ClientForm from './_components/ClientForm';

type Props = {
  params: Promise<{ name: string }>;
};

const ClientsDetailCMS: FC<Props> = async ({ params }) => {
  const { name } = await params;
  const isEdit = name !== 'new';

  let initialData: Client | null = null;

  if (isEdit) {
    const result = await getClientById(name);
    if (result.success && result.data) {
      initialData = result.data as Client;
    }
  }

  return <ClientForm initialData={initialData} />;
};

export default ClientsDetailCMS;
