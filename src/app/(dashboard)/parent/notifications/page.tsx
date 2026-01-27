/**
 * Fichier : src/app/(dashboard)/parent/notifications/page.tsx
 * Rôle : Page des notifications pour les parents
 */

'use client'

import { Card } from "@/shared/components/ui/Card";
import { AlertCircle } from "lucide-react";

export default function ParentNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Notifications
        </h1>
        <p className="text-neutral-600">
          Suivez l'activité de vos enfants en temps réel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Total</p>
          <p className="text-3xl font-bold text-neutral-900">28</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Non lues</p>
          <p className="text-3xl font-bold text-orange-600">5</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Enfants</p>
          <p className="text-3xl font-bold text-secondary-600">2</p>
        </Card>
      </div>

      <Card padding="lg">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 text-lg">
            Aucune notification pour le moment
          </p>
        </div>
      </Card>
    </div>
  )
}