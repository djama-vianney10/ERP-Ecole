/**
 * Fichier : src/app/(dashboard)/student/notifications/page.tsx
 * Rôle : Page des notifications
 */

'use client'

import { Card } from "@/shared/components/ui/Card";

export default function StudentNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Notifications</h1>
        <p className="text-neutral-600">Restez informé de toute votre activité académique</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Total</p>
          <p className="text-3xl font-bold text-neutral-900">15</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Non lues</p>
          <p className="text-3xl font-bold text-orange-600">5</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Cette semaine</p>
          <p className="text-3xl font-bold text-secondary-600">8</p>
        </Card>
      </div>

      <Card padding="lg">
        <div className="text-center py-12">
          <p className="text-neutral-600 text-lg">
            Aucune notification pour le moment
          </p>
        </div>
      </Card>
    </div>
  )
}