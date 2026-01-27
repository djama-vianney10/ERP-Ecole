'use client'

/**
 * Fichier : src/app/(dashboard)/admin/events/page.tsx
 * Rôle : Page de gestion des événements avec upload d'images
 */

import Button from "@/shared/components/ui/Button"
import { Card } from "@/shared/components/ui/Card"
import { Calendar, Plus, Search } from "lucide-react"
import { useState } from "react"

export default function AdminEventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Gestion des Événements
          </h1>
          <p className="text-neutral-600">
            Créez et gérez les événements de l'établissement avec images
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setIsModalOpen(true)}
        >
          Nouvel Événement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Total</p>
          <p className="text-3xl font-bold text-neutral-900">12</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Actifs</p>
          <p className="text-3xl font-bold text-green-600">8</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Ce Mois</p>
          <p className="text-3xl font-bold text-primary-600">5</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Avec Images</p>
          <p className="text-3xl font-bold text-secondary-600">7</p>
        </Card>
      </div>

      {/* Barre de recherche */}
      <Card padding="lg">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="all">Tous les types</option>
            <option value="EXAM">Examens</option>
            <option value="HOLIDAY">Vacances</option>
            <option value="ANNOUNCEMENT">Annonces</option>
          </select>
        </div>
      </Card>

      {/* Placeholder pour les événements */}
      <Card padding="lg">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 text-lg mb-2">
            Aucun événement créé
          </p>
          <p className="text-sm text-neutral-500 mb-6">
            Créez votre premier événement avec une image pour qu'il apparaisse sur la page d'accueil
          </p>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Créer un événement
          </Button>
        </div>
      </Card>

      {/* Note importante */}
      <Card padding="lg" className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">💡</span>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Upload d'images avec Vercel Blob
            </h4>
            <p className="text-sm text-blue-800">
              Les images des événements sont stockées sur Vercel Blob. Assurez-vous d'avoir configuré <code className="px-2 py-1 bg-blue-100 rounded">BLOB_READ_WRITE_TOKEN</code> dans vos variables d'environnement.
            </p>
            <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Formats acceptés : JPG, PNG, WEBP, GIF</li>
              <li>Taille maximum : 5MB par image</li>
              <li>Les images sont optimisées automatiquement</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}