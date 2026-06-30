export interface OrderSetting {
  id: string;
  serviceCharge: boolean | null;
  serviceType: 'FIXED' | 'PERCENTAGE';
  value: number | null;
  createdAt: Date;
  updatedAt: Date;
}
