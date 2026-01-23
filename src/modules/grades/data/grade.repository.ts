/**
 * Fichier : src/modules/grades/data/grade.repository.ts
 * Rôle : Couche d'accès aux données pour les notes
 * Architecture : Repository Pattern - abstraction de Prisma
 */

import prisma from '@/shared/lib/prisma'
import { GradeType, AcademicPeriod } from '@prisma/client'

export interface CreateGradeData {
  studentId: string
  subjectId: string
  teacherId: string
  academicYearId: string
  type: GradeType
  period: AcademicPeriod
  score: number
  maxScore?: number
  weight?: number
  evaluationDate: Date
  description?: string
}

export interface GradeFilters {
  studentId?: string
  subjectId?: string
  teacherId?: string
  academicYearId?: string
  period?: AcademicPeriod
  type?: GradeType
}

export class GradeRepository {
  /**
   * Créer une note
   */
  static async create(data: CreateGradeData) {
    return await prisma.grade.create({
      data: {
        ...data,
        maxScore: data.maxScore || 20,
        weight: data.weight || 1,
      },
      include: {
        student: {
          include: { user: true },
        },
        subject: true,
        teacher: true,
      },
    })
  }

  /**
   * Trouver une note par ID
   */
  static async findById(id: string) {
    return await prisma.grade.findUnique({
      where: { id },
      include: {
        student: {
          include: { user: true },
        },
        subject: true,
        teacher: true,
        academicYear: true,
      },
    })
  }

  /**
   * Trouver toutes les notes avec filtres
   */
  static async findMany(filters: GradeFilters) {
    return await prisma.grade.findMany({
      where: {
        ...(filters.studentId && { studentId: filters.studentId }),
        ...(filters.subjectId && { subjectId: filters.subjectId }),
        ...(filters.teacherId && { teacherId: filters.teacherId }),
        ...(filters.academicYearId && { academicYearId: filters.academicYearId }),
        ...(filters.period && { period: filters.period }),
        ...(filters.type && { type: filters.type }),
      },
      include: {
        student: {
          include: { user: true },
        },
        subject: true,
        teacher: true,
      },
      orderBy: {
        evaluationDate: 'desc',
      },
    })
  }

  /**
   * Obtenir les notes d'un élève pour une période
   */
  static async getStudentGradesByPeriod(
    studentId: string,
    academicYearId: string,
    period: AcademicPeriod
  ) {
    return await prisma.grade.findMany({
      where: {
        studentId,
        academicYearId,
        period,
      },
      include: {
        subject: true,
        teacher: true,
      },
      orderBy: {
        subject: {
          name: 'asc',
        },
      },
    })
  }

  /**
   * Obtenir toutes les notes d'un élève par matière
   */
  static async getStudentGradesBySubject(
    studentId: string,
    subjectId: string,
    academicYearId: string
  ) {
    return await prisma.grade.findMany({
      where: {
        studentId,
        subjectId,
        academicYearId,
      },
      orderBy: {
        evaluationDate: 'asc',
      },
    })
  }

  /**
   * Mettre à jour une note
   */
  static async update(id: string, data: Partial<CreateGradeData>) {
    return await prisma.grade.update({
      where: { id },
      data,
      include: {
        student: {
          include: { user: true },
        },
        subject: true,
        teacher: true,
      },
    })
  }

  /**
   * Supprimer une note
   */
  static async delete(id: string) {
    return await prisma.grade.delete({
      where: { id },
    })
  }

  /**
   * Obtenir les statistiques d'une classe pour une matière
   */
  static async getClassStatsBySubject(
    classId: string,
    subjectId: string,
    academicYearId: string,
    period: AcademicPeriod
  ) {
    // Récupérer tous les élèves de la classe
    const enrollments = await prisma.enrollment.findMany({
      where: {
        classId,
        academicYearId,
        status: 'ACTIVE',
      },
      select: { studentId: true },
    })

    const studentIds = enrollments.map((e) => e.studentId)

    // Récupérer toutes les notes
    const grades = await prisma.grade.findMany({
      where: {
        studentId: { in: studentIds },
        subjectId,
        academicYearId,
        period,
      },
    })

    // Calculer les statistiques
    const normalizedScores = grades.map((g) => (g.score / g.maxScore) * 20)
    const average = normalizedScores.length > 0
      ? normalizedScores.reduce((a, b) => a + b, 0) / normalizedScores.length
      : 0

    return {
      count: grades.length,
      average: parseFloat(average.toFixed(2)),
      min: normalizedScores.length > 0 ? Math.min(...normalizedScores) : 0,
      max: normalizedScores.length > 0 ? Math.max(...normalizedScores) : 0,
    }
  }
}