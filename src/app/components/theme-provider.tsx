"use client"
// Minimal wrapper around next-themes to enable light/dark theme switching.
 
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
 
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Pass through all props. You can set defaultTheme or attribute here if needed.
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
