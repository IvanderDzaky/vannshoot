'use client';
import { useState, useEffect } from 'react';

type ScreenSize = {
  width: number;
  height: number;
};

const useScreenSize = (): string | undefined => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: 0,
    height: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isClient) {
    return undefined;
  }

  if (screenSize.width <= 374) {
    return 'Mobile XS';
  } else if (screenSize.width >= 375 && screenSize.width <= 424) {
    return 'Mobile M';
  } else if (screenSize.width >= 425 && screenSize.width <= 765) {
    return 'Mobile L';
  } else if (screenSize.width >= 768 && screenSize.width <= 1023) {
    return 'Tablet';
  } else if (screenSize.width >= 1024 && screenSize.width <= 1439) {
    return 'Laptop';
  } else if (screenSize.width >= 1440 && screenSize.width <= 2559) {
    return 'Laptop LG';
  } else if (screenSize.width >= 2560) {
    return 'Laptop XL';
  }

  return undefined;
};

export default useScreenSize;
