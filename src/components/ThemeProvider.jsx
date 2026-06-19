"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider 
      attribute="data-theme" /* Tells next-themes to control data-theme="..." */
      valueToAttribute={(value) => ({
        "data-theme": value,
        class: value, // Also passes it as a class string so traditional dark: classes continue working
      })}
      defaultTheme="dark" 
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}