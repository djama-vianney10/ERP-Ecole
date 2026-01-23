/**
 * Fichier : src/shared/lib/prisma.ts
 * Rôle : Instance singleton de Prisma Client pour éviter les connexions multiples
 * Architecture : Pattern Singleton avec support Hot Module Reload (Next.js Dev)
 * Dépendances : @prisma/client
 */

import { PrismaClient } from '@prisma/client'

// Extension du type global pour TypeScript
declare global {
  var prisma: PrismaClient | undefined
}

// Configuration du client avec logging en développement
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  })
}

// Singleton pattern : réutilise l'instance existante en dev (HMR)
const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Gestion propre de la déconnexion
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}

export default prisma