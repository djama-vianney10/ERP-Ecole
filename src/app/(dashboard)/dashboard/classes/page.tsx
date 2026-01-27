/**
 * Fichier : src/app/(dashboard)/admin/classes/page.tsx
 * Rôle : Page de gestion des classes
 */

'use client'

import Button from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Plus } from "lucide-react";

export default function AdminClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Gestion des Classes
          </h1>
          <p className="text-neutral-600">
            Organisez les classes et les inscriptions
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
          Nouvelle classe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Total classes</p>
          <p className="text-3xl font-bold text-neutral-900">28</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Élèves inscrits</p>
          <p className="text-3xl font-bold text-primary-600">845</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Moyenne/classe</p>
          <p className="text-3xl font-bold text-secondary-600">30</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Taux remplissage</p>
          <p className="text-3xl font-bold text-accent-600">84%</p>
        </Card>
      </div>
    </div>
  )
}