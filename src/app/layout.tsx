/**
 * Fichier : src/app/layout.tsx
 * Rôle : Layout racine de l'application
 * Architecture : Next.js App Router - Root Layout
 */

import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'ERP Scolaire CI - Excellence & Innovation Éducative',
  description: 'Plateforme moderne de gestion scolaire pour les établissements d\'excellence en Côte d\'Ivoire. Suivi temps réel, notifications instantanées et outils pédagogiques innovants.',
  keywords: ['ERP scolaire', 'Côte d\'Ivoire', 'gestion scolaire', 'éducation', 'Abidjan'],
  authors: [{ name: 'ERP Scolaire CI' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'ERP Scolaire CI - Excellence & Innovation',
    description: 'Système de gestion éducative moderne pour la Côte d\'Ivoire',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${montserrat.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}