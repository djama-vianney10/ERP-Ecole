/**
 * Fichier : src/app/(auth)/login/page.tsx
 * Rôle : Page de connexion avec design institutionnel ivoirien
 * Architecture : Client Component avec animations Framer Motion
 */

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, AlertCircle, ArrowBigLeft } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import Input from '@/shared/components/ui/Input'
import Button from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(formData)

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Erreur de connexion')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-50 to-blue-900 rounded-2xl mb-4 shadow-medium"
          >
            <span className="text-3xl font-bold text-white">GSA</span>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            GS Arhogninci
          </h1>
          <p className="text-neutral-600">
            Système de Gestion Éducative - Côte d'Ivoire
          </p>
        </div>

        {/* Formulaire */}
        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            <Input
              label="Adresse email"
              type="email"
              placeholder="votre.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="w-5 h-5" />}
              required
              autoComplete="email"
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              leftIcon={<Lock className="w-5 h-5" />}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
              rightIcon={<LogIn className="w-5 h-5" />}
            >
              Se connecter
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 text-center">
              Mot de passe oublié ?{' '}
              <a href="#" className="text-primary-600 hover:underline font-medium">
                Réinitialiser
              </a>
            </p>
          </div>
          <div className='mt-6 flex flex-row justify-center items-center'>
            <ArrowBigLeft className='w-5 h-5 text-blue-900' />
            <Link href="/"  className='text-sm text-blue-900 text-center'>
                Retour à l'Acceuil
            </Link>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          © 2024 GS Arhogninci CI. Tous droits réservés.
        </p>
      </motion.div>
    </div>
  )
}