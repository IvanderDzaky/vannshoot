'use client';
import type { FC } from 'react';

import type { ApiListAlert as ApiListProps } from '@/interfaces/alert';
import { useOrigin } from '@/hooks/useOrigin';
import ApiAlert from './ApiAlert';

const ApiListAlert: FC<ApiListProps> = ({ entityName, entityIdName }) => {
  const origin = useOrigin();

  const baseUrl = `${origin}/api`;

  return (
    <>
      <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}`} />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert title="POST" variant="admin" description={`${baseUrl}/${entityName}`} />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  );
};

export default ApiListAlert;
