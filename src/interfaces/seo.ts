export interface PageSEOProps {
  title: string;
  description?: string;
  image?: string;

  [key: string]: string | number | boolean | undefined;
}
