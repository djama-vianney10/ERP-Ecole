/**
 * Fichier : src/app/(dashboard)/teacher/grades/page.tsx
 * Rôle : Page de saisie des notes
 */

'use client'

import Button from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { FileText } from "lucide-react";

export default function TeacherGradesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Gestion des Notes
        </h1>
        <p className="text-neutral-600">
          Saisissez et consultez les notes de vos élèves
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Notes saisies</p>
          <p className="text-3xl font-bold text-neutral-900">142</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Moyenne classe</p>
          <p className="text-3xl font-bold text-neutral-900">13.8</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">À saisir</p>
          <p className="text-3xl font-bold text-orange-600">8</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Cette semaine</p>
          <p className="text-3xl font-bold text-secondary-600">12</p>
        </Card>
      </div>

      <Card padding="lg">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 text-lg">
            Interface de saisie des notes
          </p>
          <Button variant="primary" className="mt-4">
            Nouvelle évaluation
          </Button>
        </div>
      </Card>
    </div>
  )
}