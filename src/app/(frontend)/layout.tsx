import React from 'react'
import { headers } from 'next/headers'
import "./styles/globals.css";
import Header from './components/Header';
import Footer from './components/Footer';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { ResourceHints } from './components/ResourceHints';
import { DebugConsole } from './components/DebugConsole';

export const metadata = {
  description: 'NCG - Next Generation Cybersecurity Solutions',
  title: 'NCG',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  
  // Get pathname from headers to conditionally render footer
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isContactPage = pathname === '/contact'
  const isFreeConsultationPage = pathname === '/free-consultation'
  const shouldHideFooter = isContactPage || isFreeConsultationPage

  return (
    <html lang="en">
      <head>
        <ResourceHints />
      </head>
      <body>
        <PerformanceMonitor />
        <DebugConsole />
        <Header />
        <main>{children}</main>
        {!shouldHideFooter && <Footer />}
      </body>
    </html>
  )
}
