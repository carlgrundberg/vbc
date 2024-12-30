import type { Metadata } from 'next'

import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Vittsjö Beer Club',
  description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <Header />
          <div className="container mx-auto p-4">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
