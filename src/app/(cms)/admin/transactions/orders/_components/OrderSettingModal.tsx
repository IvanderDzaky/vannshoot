'use client';

import { type FC, useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getOrderSetting, updateOrderSetting } from '@/services/order-settings';
import { orderSettingSchema, type OrderSettingFormValues } from '@/schemas/order-settings';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

interface OrderSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderSettingModal: FC<OrderSettingModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const { data: settingResult, isLoading } = useQuery({
    queryKey: ['order-settings'],
    queryFn: async () => await getOrderSetting(),
    enabled: isOpen,
  });

  const form = useForm<OrderSettingFormValues>({
    resolver: zodResolver(orderSettingSchema),
    defaultValues: {
      serviceCharge: false,
      serviceType: 'FIXED',
      value: 0,
    },
    mode: 'onChange',
  });

  const { reset } = form;

  useEffect(() => {
    if (settingResult?.success && settingResult.data) {
      reset({
        serviceCharge: settingResult.data.serviceCharge ?? false,
        serviceType: settingResult.data.serviceType ?? 'FIXED',
        value: settingResult.data.value ?? 0,
      });
    }
  }, [settingResult, reset]);

  const serviceCharge = useWatch({
    control: form.control,
    name: 'serviceCharge',
  });

  const submitMutation = useMutation({
    mutationFn: async (values: OrderSettingFormValues) => {
      return await updateOrderSetting(values);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Pengaturan order berhasil disimpan.');
        queryClient.invalidateQueries({ queryKey: ['order-settings'] });
        onClose();
      } else {
        toast.error(result.error);
      }
    },
  });

  const onSubmit = (values: OrderSettingFormValues) => {
    submitMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pengaturan Order</DialogTitle>
          <DialogDescription>
            Konfigurasi biaya layanan dan komisi transaksi order.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Spinner className="h-8 w-8 text-primary" />
            <span className="text-sm text-muted-foreground text-center">Memuat pengaturan...</span>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <FieldGroup>
              {/* Dropdown 1: Gunakan Biaya Layanan? */}
              <Controller
                name="serviceCharge"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Gunakan Biaya Layanan?</FieldLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === 'true')}
                      value={field.value ? 'true' : 'false'}
                    >
                      <SelectTrigger className="w-full max-w-full">
                        <SelectValue placeholder="Pilih Opsi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Ya</SelectItem>
                        <SelectItem value="false">Tidak</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Card untuk Jenis & Nilai Biaya (Kondisional) */}
              {serviceCharge && (
                <Card className="bg-muted/15 border border-border/80 shadow-none p-5 rounded-lg">
                  <CardContent className="space-y-5 p-0">
                    {/* Dropdown 2: Jenis Biaya */}
                    <Controller
                      name="serviceType"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Jenis Biaya</FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full max-w-full">
                              <SelectValue placeholder="Pilih Jenis Biaya" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FIXED">Rupiah (Jumlah Tetap)</SelectItem>
                              <SelectItem value="PERCENTAGE">Persentase</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    {/* Input 3: Nilai Biaya */}
                    <Controller
                      name="value"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Nilai Biaya</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            step="any"
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === '' ? null : Number(val));
                            }}
                            aria-invalid={fieldState.invalid}
                            placeholder="Contoh: 2000 atau 2.5"
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </CardContent>
                </Card>
              )}
            </FieldGroup>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderSettingModal;
