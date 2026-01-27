/**
 * Fichier : src/app/(dashboard)/admin/settings/page.tsx
 * Rôle : Page des paramètres système
 */

'use client'

import Button from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Paramètres
        </h1>
        <p className="text-neutral-600">
          Configurez les paramètres de l'établissement
        </p>
      </div>

      <Card padding="lg">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Informations Générales
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom de l'établissement
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="ERP Scolaire CI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Année académique
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="2024-2025"
                />
              </div>
            </div>
          </div>

          <Button variant="primary">
            Enregistrer les modifications
          </Button>
        </div>
      </Card>
    </div>
  )
}