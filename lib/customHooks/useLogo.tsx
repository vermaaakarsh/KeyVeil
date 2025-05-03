"use client";

import { useEffect, useState } from "react";
import KeyVeilLogoDark from "../../public/keyveil-logo-dark.png";
import KeyVeilLogoLight from "../../public/keyveil-logo-light.png";
import { useTheme } from "next-themes";

const useLogo = () => {
  const { theme, systemTheme } = useTheme();
  const [keyVeilLogo, setKeyVeilLogo] = useState(KeyVeilLogoLight);

  const getLogo = () => {
    let currentTheme = theme;
    if (theme === "system") {
      currentTheme = systemTheme;
    }
    if (currentTheme === "light") {
      setKeyVeilLogo(KeyVeilLogoLight);
    } else {
      setKeyVeilLogo(KeyVeilLogoDark);
    }
  };

  useEffect(() => {
    getLogo();
  }, [theme]);

  return { keyVeilLogo };
};

export default useLogo;
