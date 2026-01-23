/**
 * Fichier : src/app/global-error.tsx
 * Rôle : Gestionnaire d'erreurs critiques globales (y compris root layout)
 * Architecture : Fallback pour les erreurs dans le root layout
 */

'use client'

import React, { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global Error:', error)
  }, [error])

  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erreur Critique
            </h1>
            
            <p className="text-gray-600 mb-6">
              Une erreur critique s'est produite. Veuillez réessayer.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-mono text-red-800 break-words">
                {error.message}
              </p>
            </div>

            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Recharger l'Application
            </button>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-600">
                  Stack Trace
                </summary>
                <pre className="mt-2 text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}