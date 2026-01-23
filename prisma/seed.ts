/**
 * Fichier : prisma/seed.ts
 * Rôle : Script de seed pour initialiser la base de données
 * Architecture : Données de test conformes au contexte ivoirien
 * Exécution : npm run prisma:seed
 */

import { PrismaClient, UserRole, Gender, AcademicLevel, GradeType, AcademicPeriod, DayOfWeek, AttendanceStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed...')

  // Nettoyer la base de données
  await prisma.notification.deleteMany()
  await prisma.attendanceRecord.deleteMany()
  await prisma.grade.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.teacherSubjectAssignment.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.parentStudent.deleteMany()
  await prisma.parent.deleteMany()
  await prisma.student.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.class.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.academicYear.deleteMany()
  await prisma.user.deleteMany()

  // Créer l'année académique
  const academicYear = await prisma.academicYear.create({
    data: {
      name: '2024-2025',
      startDate: new Date('2024-09-02'),
      endDate: new Date('2025-06-30'),
      isCurrent: true,
    },
  })

  console.log('✅ Année académique créée')

  // Créer les matières
  const subjects = await Promise.all([
    prisma.subject.create({ data: { name: 'Mathématiques', code: 'MATH', coefficient: 4 } }),
    prisma.subject.create({ data: { name: 'Français', code: 'FR', coefficient: 4 } }),
    prisma.subject.create({ data: { name: 'Anglais', code: 'EN', coefficient: 2 } }),
    prisma.subject.create({ data: { name: 'Histoire-Géographie', code: 'HG', coefficient: 2 } }),
    prisma.subject.create({ data: { name: 'Sciences Physiques', code: 'PC', coefficient: 3 } }),
    prisma.subject.create({ data: { name: 'SVT', code: 'SVT', coefficient: 3 } }),
    prisma.subject.create({ data: { name: 'EPS', code: 'EPS', coefficient: 1 } }),
  ])

  console.log('✅ Matières créées')

  // Créer les classes
  const classes = await Promise.all([
    prisma.class.create({ data: { name: '6ème A', level: AcademicLevel.SIXIEME, capacity: 40, academicYearId: academicYear.id } }),
    prisma.class.create({ data: { name: '6ème B', level: AcademicLevel.SIXIEME, capacity: 40, academicYearId: academicYear.id } }),
    prisma.class.create({ data: { name: '3ème A', level: AcademicLevel.TROISIEME, capacity: 35, academicYearId: academicYear.id } }),
    prisma.class.create({ data: { name: 'Terminale C', level: AcademicLevel.TERMINALE, capacity: 30, academicYearId: academicYear.id } }),
  ])

  console.log('✅ Classes créées')

  // Hash de mot de passe commun pour la démo
  const passwordHash = await bcrypt.hash('demo123', 12)

  // Créer un administrateur
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ecole.ci',
      passwordHash,
      role: UserRole.ADMIN,
      status: 'ACTIVE',
    },
  })

  console.log('✅ Admin créé')

  // Créer un directeur
  const principalUser = await prisma.user.create({
    data: {
      email: 'directeur@ecole.ci',
      passwordHash,
      role: UserRole.PRINCIPAL,
      status: 'ACTIVE',
    },
  })

  // Créer des enseignants
  const teacher1User = await prisma.user.create({
    data: {
      email: 'prof.math@ecole.ci',
      phone: '+225 07 12 34 56 78',
      passwordHash,
      role: UserRole.TEACHER,
      status: 'ACTIVE',
      teacherProfile: {
        create: {
          firstName: 'Kouassi',
          lastName: 'N\'Guessan',
          specialty: 'Mathématiques',
          hireDate: new Date('2020-09-01'),
        },
      },
    },
  })

  const teacher2User = await prisma.user.create({
    data: {
      email: 'prof.francais@ecole.ci',
      passwordHash,
      role: UserRole.TEACHER,
      status: 'ACTIVE',
      teacherProfile: {
        create: {
          firstName: 'Adjoua',
          lastName: 'Koffi',
          specialty: 'Français',
          hireDate: new Date('2019-09-01'),
        },
      },
    },
  })

  const teacher1 = await prisma.teacher.findUnique({ where: { userId: teacher1User.id } })
  const teacher2 = await prisma.teacher.findUnique({ where: { userId: teacher2User.id } })

  console.log('✅ Enseignants créés')

  // Assigner les matières aux enseignants
  await prisma.teacherSubjectAssignment.createMany({
    data: [
      { teacherId: teacher1!.id, subjectId: subjects[0].id, classId: classes[0].id }, // Math 6A
      { teacherId: teacher1!.id, subjectId: subjects[0].id, classId: classes[1].id }, // Math 6B
      { teacherId: teacher2!.id, subjectId: subjects[1].id, classId: classes[0].id }, // FR 6A
      { teacherId: teacher2!.id, subjectId: subjects[1].id, classId: classes[1].id }, // FR 6B
    ],
  })

  console.log('✅ Assignations enseignants créées')

  // Créer des élèves avec parents
  const student1User = await prisma.user.create({
    data: {
      email: 'yao.kouame@example.com',
      passwordHash,
      role: UserRole.STUDENT,
      status: 'ACTIVE',
      studentProfile: {
        create: {
          firstName: 'Yao',
          lastName: 'Kouamé',
          dateOfBirth: new Date('2012-03-15'),
          gender: Gender.MALE,
          matricule: '20240001',
          placeOfBirth: 'Abidjan',
        },
      },
    },
  })

  const student2User = await prisma.user.create({
    data: {
      email: 'aya.kone@example.com',
      passwordHash,
      role: UserRole.STUDENT,
      status: 'ACTIVE',
      studentProfile: {
        create: {
          firstName: 'Aya',
          lastName: 'Koné',
          dateOfBirth: new Date('2012-07-22'),
          gender: Gender.FEMALE,
          matricule: '20240002',
          placeOfBirth: 'Bouaké',
        },
      },
    },
  })

  const student1 = await prisma.student.findUnique({ where: { userId: student1User.id } })
  const student2 = await prisma.student.findUnique({ where: { userId: student2User.id } })

  console.log('✅ Élèves créés')

  // Créer des parents
  const parent1User = await prisma.user.create({
    data: {
      email: 'kouame.parent@example.com',
      phone: '+225 05 11 22 33 44',
      passwordHash,
      role: UserRole.PARENT,
      status: 'ACTIVE',
      parentProfile: {
        create: {
          firstName: 'Jean',
          lastName: 'Kouamé',
          relationship: 'Père',
          occupation: 'Ingénieur',
          address: 'Cocody, Abidjan',
        },
      },
    },
  })

  const parent1 = await prisma.parent.findUnique({ where: { userId: parent1User.id } })

  // Lier parent-enfant
  await prisma.parentStudent.create({
    data: {
      parentId: parent1!.id,
      studentId: student1!.id,
      isPrimary: true,
    },
  })

  console.log('✅ Parents créés et liés')

  // Inscrire les élèves dans les classes
  await prisma.enrollment.createMany({
    data: [
      {
        studentId: student1!.id,
        classId: classes[0].id,
        academicYearId: academicYear.id,
        enrollmentDate: new Date('2024-09-02'),
        status: 'ACTIVE',
      },
      {
        studentId: student2!.id,
        classId: classes[0].id,
        academicYearId: academicYear.id,
        enrollmentDate: new Date('2024-09-02'),
        status: 'ACTIVE',
      },
    ],
  })

  console.log('✅ Inscriptions créées')

  // Créer des notes
  const grade1 = await prisma.grade.create({
    data: {
      studentId: student1!.id,
      subjectId: subjects[0].id,
      teacherId: teacher1!.id,
      academicYearId: academicYear.id,
      type: GradeType.DEVOIR,
      period: AcademicPeriod.TRIMESTRE_1,
      score: 16,
      maxScore: 20,
      weight: 1,
      evaluationDate: new Date('2024-10-15'),
      description: 'Devoir n°1 - Nombres et opérations',
    },
  })

  await prisma.grade.create({
    data: {
      studentId: student1!.id,
      subjectId: subjects[1].id,
      teacherId: teacher2!.id,
      academicYearId: academicYear.id,
      type: GradeType.DEVOIR,
      period: AcademicPeriod.TRIMESTRE_1,
      score: 14,
      maxScore: 20,
      weight: 1,
      evaluationDate: new Date('2024-10-20'),
      description: 'Devoir n°1 - Grammaire',
    },
  })

  console.log('✅ Notes créées')

  // Créer des absences
  await prisma.attendanceRecord.create({
    data: {
      studentId: student1!.id,
      teacherId: teacher1!.id,
      date: new Date('2024-11-05'),
      status: AttendanceStatus.ABSENT,
      isJustified: false,
    },
  })

  console.log('✅ Assiduité créée')

  // Créer des emplois du temps
  await prisma.schedule.createMany({
    data: [
      {
        classId: classes[0].id,
        subjectId: subjects[0].id,
        dayOfWeek: DayOfWeek.MONDAY,
        startTime: '08:00',
        endTime: '10:00',
        room: 'Salle 101',
      },
      {
        classId: classes[0].id,
        subjectId: subjects[1].id,
        dayOfWeek: DayOfWeek.MONDAY,
        startTime: '10:15',
        endTime: '12:15',
        room: 'Salle 102',
      },
      {
        classId: classes[0].id,
        subjectId: subjects[2].id,
        dayOfWeek: DayOfWeek.TUESDAY,
        startTime: '08:00',
        endTime: '10:00',
        room: 'Salle 103',
      },
    ],
  })

  console.log('✅ Emplois du temps créés')

  console.log('🎉 Seed terminé avec succès !')
  console.log('\n📧 Comptes de test :')
  console.log('Admin: admin@ecole.ci / demo123')
  console.log('Enseignant Math: prof.math@ecole.ci / demo123')
  console.log('Enseignant FR: prof.francais@ecole.ci / demo123')
  console.log('Élève 1: yao.kouame@example.com / demo123')
  console.log('Parent: kouame.parent@example.com / demo123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })