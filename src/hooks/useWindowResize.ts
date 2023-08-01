import { useState, useLayoutEffect } from 'react';
import { MobileScreenWidth } from '../const';
export const useWindowSize = (initValue = [0, 0]) => {
  const [size, setSize] = useState([...initValue]);
  const isDesktop = size[0] >= MobileScreenWidth;

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return { isDesktop, size };
};
