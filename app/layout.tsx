import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plant Care App',
  description: 'Keep your plants healthy and thriving',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
