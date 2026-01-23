/**
 * Fichier : src/app/error.tsx
 * Rôle : Gestionnaire d'erreurs global de l'application
 * Architecture : Error Boundary Next.js App Router
 */

'use client'

import React, { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log l'erreur dans un service de monitoring (ex: Sentry)
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Oups ! Une erreur est survenue
          </h1>
          <p className="text-lg text-gray-600">
            Quelque chose s'est mal passé, mais ne vous inquiétez pas !
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Détails de l'erreur
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-mono text-red-800 break-words">
                {error.message || 'Une erreur inattendue s\'est produite'}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  ID d'erreur : {error.digest}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={reset}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Réessayer
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Accueil
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">
            Besoin d'aide ?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Si le problème persiste, n'hésitez pas à contacter notre support technique.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="mailto:support@erp-scolaire.ci"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Mail className="w-4 h-4" />
              support@erp-scolaire.ci
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="tel:+22507XXXXXXXX"
              className="text-blue-600 hover:text-blue-700"
            >
              +225 07 XX XX XX XX
            </a>
          </div>
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 bg-gray-900 text-gray-100 rounded-lg p-4">
            <summary className="cursor-pointer font-mono text-sm mb-2">
              Stack Trace (Dev Only)
            </summary>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}