export const formatLocalTime = (dateString: string | Date): string => {
  const date = new Date(dateString);

  // Cek apakah tanggal valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  // Format tanggal sebagai dd/mm/yyyy
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
