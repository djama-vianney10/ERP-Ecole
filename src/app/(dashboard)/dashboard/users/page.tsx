/**
 * Fichier : src/app/(dashboard)/admin/users/page.tsx
 * Rôle : Page de gestion des utilisateurs
 */

'use client'

import { Users, Plus} from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import Button from '@/shared/components/ui/Button'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Gestion des Utilisateurs
          </h1>
          <p className="text-neutral-600">
            Gérez les comptes utilisateurs de l'établissement
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
          Nouvel utilisateur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Total</p>
          <p className="text-3xl font-bold text-neutral-900">924</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Élèves</p>
          <p className="text-3xl font-bold text-primary-600">845</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Enseignants</p>
          <p className="text-3xl font-bold text-secondary-600">42</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Parents</p>
          <p className="text-3xl font-bold text-accent-600">37</p>
        </Card>
      </div>

      <Card padding="lg">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 text-lg">
            Liste des utilisateurs à implémenter
          </p>
        </div>
      </Card>
    </div>
  )
}
