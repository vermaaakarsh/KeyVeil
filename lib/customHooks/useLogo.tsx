'use client';

import { useTheme } from 'next-themes';
import KeyVeilLogoDark from '../../public/keyveil-logo-dark.png';
import KeyVeilLogoLight from '../../public/keyveil-logo-light.png';

const useLogo = () => {
  const { theme, systemTheme } = useTheme();

  if (!theme) return { keyVeilLogo: KeyVeilLogoLight };

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return {
    keyVeilLogo: currentTheme === 'light' ? KeyVeilLogoLight : KeyVeilLogoDark,
  };
};

export default useLogo;
