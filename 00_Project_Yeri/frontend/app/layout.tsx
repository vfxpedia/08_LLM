// frontend/app/layout.tsx

import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yeri Observation Game',
  description: '예리는 못 말려 - 감정 관찰 게임',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
