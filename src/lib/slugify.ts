export function slugify(text: string): string {
  return (
    text
      .toString()
      // Hapus emoji dan karakter Unicode non-ASCII (termasuk 🎯, dsb)
      .replace(/[^\u0000-\u007E]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Ganti spasi dengan -
      .replace(/[^\w-]+/g, '') // Hapus semua karakter non-word (termasuk ?, !, :, dll)
      .replace(/--+/g, '-') // Ganti multiple - dengan single -
      .replace(/^-+|-+$/g, '')
  ); // Trim - di awal/akhir
}
