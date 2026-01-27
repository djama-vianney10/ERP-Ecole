/**
 * Fichier : src/app/(dashboard)/teacher/attendance/page.tsx
 * Rôle : Page de gestion des absences
 */

'use client'

import Button from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Calendar } from "lucide-react";

export default function TeacherAttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Gestion de l'Assiduité
        </h1>
        <p className="text-neutral-600">
          Enregistrez et suivez les présences des élèves
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Présents aujourd'hui</p>
          <p className="text-3xl font-bold text-green-600">92</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Absents</p>
          <p className="text-3xl font-bold text-red-600">5</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Retards</p>
          <p className="text-3xl font-bold text-orange-600">3</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-sm text-neutral-600 mb-1">Taux de présence</p>
          <p className="text-3xl font-bold text-neutral-900">94%</p>
        </Card>
      </div>

      <Card padding="lg">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 text-lg">
            Feuille d'appel du jour
          </p>
          <Button variant="primary" className="mt-4">
            Faire l'appel
          </Button>
        </div>
      </Card>
    </div>
  )
}