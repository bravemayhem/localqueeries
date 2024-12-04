import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/app/components/layout/Navigation'
import Footer from '@/app/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Local Queeries',
  description: 'Connect with LGBTQIA+ and allied service providers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}