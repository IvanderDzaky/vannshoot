'use client';
import { type FC, memo } from 'react';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/Common/Heading';

type PermissionPreviewProps = {
  nameValue: string;
  isCrudMode: boolean;
};

const suffixColors: Record<string, string> = {
  read: 'bg-blue-500/10 text-blue-600',
  create: 'bg-emerald-500/10 text-emerald-600',
  update: 'bg-amber-500/10 text-amber-600',
  delete: 'bg-rose-500/10 text-rose-600',
};

const PermissionPreview: FC<PermissionPreviewProps> = memo(({ nameValue, isCrudMode }) => {
  return (
    <div className="bg-sidebar p-6 rounded-2xl border space-y-6">
      <Heading
        title="Pratinjau"
        description="Ini adalah pratinjau dari hak akses yang akan dibuat."
      />

      <div className="flex flex-wrap gap-2">
        {isCrudMode ? (
          ['read', 'create', 'update', 'delete'].map((suffix) => {
            const moduleName = nameValue || '[modul].[sub_modul]';

            return (
              <Badge key={suffix} className={suffixColors[suffix]} variant="outline">
                {moduleName}.{suffix}
              </Badge>
            );
          })
        ) : (
          <Badge
            className={
              suffixColors[nameValue?.split('.').pop() || ''] || 'bg-gray-500/10 text-gray-600'
            }
            variant="outline"
          >
            {nameValue || 'Belum ada nama'}
          </Badge>
        )}
      </div>
    </div>
  );
});

PermissionPreview.displayName = 'PermissionPreview';

export default PermissionPreview;
