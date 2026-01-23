/**
 * Fichier : src/shared/lib/utils.ts
 * Rôle : Fonctions utilitaires réutilisables dans toute l'application
 * Architecture : Bibliothèque de helpers pour Tailwind, dates, validation
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * Merge conditionnel de classes Tailwind (évite les conflits)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatage de date en français
 */
export function formatDate(date: Date | string, pattern: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, pattern, { locale: fr })
}

/**
 * Formatage de date relative (il y a X jours)
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInMinutes = Math.floor(diffInMs / 60000)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return "À l'instant"
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
  if (diffInHours < 24) return `Il y a ${diffInHours}h`
  if (diffInDays < 7) return `Il y a ${diffInDays}j`
  return formatDate(dateObj, 'dd MMM yyyy')
}

/**
 * Calcul de moyenne pondérée
 */
export function calculateWeightedAverage(
  grades: Array<{ score: number; weight: number; maxScore: number }>
): number {
  if (grades.length === 0) return 0

  const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0)
  const weightedSum = grades.reduce((sum, g) => {
    const normalizedScore = (g.score / g.maxScore) * 20 // Normalisation sur 20
    return sum + (normalizedScore * g.weight)
  }, 0)

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

/**
 * Génération de matricule unique élève (format: YYYY-XXXX)
 */
export function generateMatricule(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${year}-${random}`
}

/**
 * Validation email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validation téléphone ivoirien
 */
export function isValidIvoryCoastPhone(phone: string): boolean {
  // Format attendu : +225 XX XX XX XX XX ou 0X XX XX XX XX
  const cleanPhone = phone.replace(/\s/g, '')
  const regexWithCode = /^\+225[0-9]{10}$/
  const regexLocal = /^0[0-9]{9}$/
  
  return regexWithCode.test(cleanPhone) || regexLocal.test(cleanPhone)
}

/**
 * Formatage de numéro de téléphone
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('225')) {
    // Format international : +225 XX XX XX XX XX
    return `+225 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)} ${cleaned.slice(11)}`
  }
  
  // Format local : 0X XX XX XX XX
  return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`
}

/**
 * Capitalisation (première lettre en majuscule)
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Obtenir les initiales d'un nom
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/**
 * Tronquer un texte avec ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Formater un nombre avec séparateur de milliers
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * Déterminer la mention selon la moyenne
 */
export function getMention(average: number): string {
  if (average >= 18) return 'Excellent'
  if (average >= 16) return 'Très Bien'
  if (average >= 14) return 'Bien'
  if (average >= 12) return 'Assez Bien'
  if (average >= 10) return 'Passable'
  return 'Insuffisant'
}

/**
 * Couleur de la mention pour l'UI
 */
export function getMentionColor(average: number): string {
  if (average >= 16) return 'text-green-600'
  if (average >= 14) return 'text-blue-600'
  if (average >= 12) return 'text-yellow-600'
  if (average >= 10) return 'text-orange-600'
  return 'text-red-600'
}

/**
 * Générer une couleur de fond aléatoire pour avatar
 */
export function getAvatarColor(seed: string): string {
  const colors = [
    'bg-primary-500',
    'bg-secondary-500',
    'bg-accent-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
  ]
  
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}