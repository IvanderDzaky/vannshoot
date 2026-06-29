import { toast } from 'sonner';

export const copyToClipboard = async (txt: string) => {
  try {
    await navigator.clipboard.writeText(txt);
    toast.success('Berhasil disalin ke papan klip!');
  } catch (err) {
    toast.error('Gagal menyalin ke papan klip!');
  }
};
