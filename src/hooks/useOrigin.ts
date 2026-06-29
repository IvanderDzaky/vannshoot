import { useMounted } from './useMounted';

export const useOrigin = () => {
  const isMounted = useMounted();

  if (!isMounted) {
    return '';
  }

  return window.location.origin;
};
