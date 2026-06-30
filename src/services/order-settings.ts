'use server';

import { prisma } from '@/lib/prisma';
import { verifyPermission } from './security';
import { orderSettingSchema, type OrderSettingFormValues } from '@/schemas/order-settings';

/**
 * Mendapatkan konfigurasi order setting.
 * Jika kosong, buat data default di database.
 */
export async function getOrderSetting() {
  const hasAccess = await verifyPermission('order.settings.read');
  if (!hasAccess) {
    return {
      success: false,
      error: 'Anda tidak memiliki hak akses untuk melihat pengaturan order.',
    };
  }

  try {
    let setting = await prisma.orderSetting.findFirst();

    if (!setting) {
      setting = await prisma.orderSetting.create({
        data: {
          serviceCharge: false,
          serviceType: 'FIXED',
          value: 0,
        },
      });
    }

    return {
      success: true,
      data: setting,
    };
  } catch (error) {
    console.error('Get Order Setting Error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan saat mengambil data pengaturan order.',
    };
  }
}

/**
 * Memperbarui data pengaturan order.
 */
export async function updateOrderSetting(values: OrderSettingFormValues) {
  const hasAccess = await verifyPermission('order.settings.update');
  if (!hasAccess) {
    return {
      success: false,
      error: 'Anda tidak memiliki hak akses untuk mengubah pengaturan order.',
    };
  }

  const validatedFields = orderSettingSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Input tidak valid.',
    };
  }

  try {
    const { serviceCharge, serviceType, value } = validatedFields.data;
    const existingSetting = await prisma.orderSetting.findFirst();

    let result;
    if (!existingSetting) {
      result = await prisma.orderSetting.create({
        data: {
          serviceCharge,
          serviceType,
          value: value ?? 0,
        },
      });
    } else {
      result = await prisma.orderSetting.update({
        where: { id: existingSetting.id },
        data: {
          serviceCharge,
          serviceType,
          value: value ?? 0,
        },
      });
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Update Order Setting Error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan saat menyimpan perubahan pengaturan order.',
    };
  }
}
