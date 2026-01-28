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
  title: 'GS Arhogninci - Bingerville',
  description: 'Plateforme moderne de gestion scolaire pour le Groupe Scolaire Arhogninci de Bingerville. Suivi temps réel, notifications instantanées et outils pédagogiques innovants.',
  keywords: ['GS Arhoginci', 'Côte d\'Ivoire', 'gestion scolaire', 'éducation', 'Abidjan', 'Bingerville', 'groupe scolaire', 'collége', 'lycée'],
  authors: [{ name: 'Djama A Vianney' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'GS Arhogninci - Bingerville - Temple Du Savoir',
    description: 'Système de gestion éducative moderne',
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