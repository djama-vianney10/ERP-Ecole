/**
 * Fichier : src/modules/auth/services/auth.service.ts
 * Rôle : Service d'authentification (login, register, validation JWT)
 * Architecture : Couche métier pure, indépendante de l'UI
 * Dépendances : bcryptjs, jsonwebtoken, Prisma
 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/shared/lib/prisma'
import type { 
  AuthUser, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  JWTPayload 
} from '../types/auth.types'
import { UserRole } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-ultra-securise'
const JWT_EXPIRES_IN = '24h'

export class AuthService {
  /**
   * Connexion utilisateur
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Vérification email
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
        include: {
          teacherProfile: true,
          studentProfile: true,
          parentProfile: true,
        },
      })

      if (!user) {
        return { success: false, error: 'Email ou mot de passe incorrect' }
      }

      // Vérification statut
      if (user.status !== 'ACTIVE') {
        return { success: false, error: 'Compte désactivé. Contactez l\'administration.' }
      }

      // Vérification mot de passe
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.passwordHash
      )

      if (!isPasswordValid) {
        return { success: false, error: 'Email ou mot de passe incorrect' }
      }

      // Mise à jour dernière connexion
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })

      // Génération du token JWT
      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      // Construction de l'objet AuthUser
      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        profileId: this.getProfileId(user),
        firstName: this.getFirstName(user),
        lastName: this.getLastName(user),
      }

      return {
        success: true,
        user: authUser,
        token,
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Erreur lors de la connexion' }
    }
  }

  /**
   * Inscription nouvel utilisateur
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Vérification unicité email
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      })

      if (existingUser) {
        return { success: false, error: 'Cet email est déjà utilisé' }
      }

      // Hash du mot de passe
      const passwordHash = await bcrypt.hash(data.password, 12)

      // Transaction : création user + profil associé
      const user = await prisma.$transaction(async (tx) => {
        // Création du user
        const newUser = await tx.user.create({
          data: {
            email: data.email,
            phone: data.phone,
            passwordHash,
            role: data.role,
            status: 'ACTIVE',
          },
        })

        // Création du profil selon le rôle
        switch (data.role) {
          case UserRole.TEACHER:
            await tx.teacher.create({
              data: {
                userId: newUser.id,
                firstName: data.firstName,
                lastName: data.lastName,
                specialty: data.metadata?.specialty,
                hireDate: new Date(),
              },
            })
            break

          case UserRole.STUDENT:
            await tx.student.create({
              data: {
                userId: newUser.id,
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: data.metadata?.dateOfBirth || new Date(),
                gender: data.metadata?.gender || 'MALE',
                matricule: data.metadata?.matricule || this.generateMatricule(),
              },
            })
            break

          case UserRole.PARENT:
            await tx.parent.create({
              data: {
                userId: newUser.id,
                firstName: data.firstName,
                lastName: data.lastName,
                relationship: data.metadata?.relationship || 'Parent',
                occupation: data.metadata?.occupation,
              },
            })
            break
        }

        return newUser
      })

      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        token,
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Erreur lors de l\'inscription' }
    }
  }

  /**
   * Vérification et décodage du token JWT
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
      return decoded
    } catch (error) {
      return null
    }
  }

  /**
   * Récupération de l'utilisateur depuis un token
   */
  static async getUserFromToken(token: string): Promise<AuthUser | null> {
    const payload = this.verifyToken(token)
    if (!payload) return null

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        teacherProfile: true,
        studentProfile: true,
        parentProfile: true,
      },
    })

    if (!user || user.status !== 'ACTIVE') return null

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      profileId: this.getProfileId(user),
      firstName: this.getFirstName(user),
      lastName: this.getLastName(user),
    }
  }

  /**
   * Génération d'un token JWT
   */
  private static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }

  /**
   * Extraction de l'ID du profil selon le rôle
   */
  private static getProfileId(user: any): string | undefined {
    if (user.teacherProfile) return user.teacherProfile.id
    if (user.studentProfile) return user.studentProfile.id
    if (user.parentProfile) return user.parentProfile.id
    return undefined
  }

  /**
   * Extraction du prénom selon le profil
   */
  private static getFirstName(user: any): string | undefined {
    if (user.teacherProfile) return user.teacherProfile.firstName
    if (user.studentProfile) return user.studentProfile.firstName
    if (user.parentProfile) return user.parentProfile.firstName
    return undefined
  }

  /**
   * Extraction du nom selon le profil
   */
  private static getLastName(user: any): string | undefined {
    if (user.teacherProfile) return user.teacherProfile.lastName
    if (user.studentProfile) return user.studentProfile.lastName
    if (user.parentProfile) return user.parentProfile.lastName
    return undefined
  }

  /**
   * Génération de matricule unique
   */
  private static generateMatricule(): string {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
    return `${year}${random}`
  }
}