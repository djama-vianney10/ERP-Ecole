/**
 * Fichier : src/app/not-found.tsx
 * Rôle : Page 404 personnalisée et moderne
 * Architecture : Error page avec animations et design ludique
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft, Sparkles } from 'lucide-react'
import Button from '@/shared/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 -left-20 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl"
      />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 100,
            damping: 15,
            duration: 0.8 
          }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="text-9xl md:text-[12rem] font-bold text-gradient leading-none"
            >
              404
            </motion.div>

            {/* Floating Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="absolute top-1/2 left-1/2"
              >
                <Sparkles className="w-6 h-6 text-primary-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Oups ! Page Introuvable
          </h1>
          <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
            La page que vous recherchez semble avoir disparu dans les méandres du cyberespace...
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Home className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Retour à l'Accueil
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="lg"
              leftIcon={<ArrowLeft className="w-5 h-5" />}
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              Page Précédente
            </Button>
          </div>

          {/* Fun Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="text-8xl mb-4"
              >
                🔍
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-primary-200 rounded-full blur-2xl -z-10"
              />
            </div>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 pt-8 border-t border-neutral-200"
          >
            <p className="text-sm text-neutral-500 mb-4">
              Peut-être cherchez-vous :
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/login">
                <span className="px-4 py-2 bg-white rounded-lg border border-neutral-200 text-sm text-neutral-700 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer">
                  Connexion
                </span>
              </Link>
              <Link href="/#about">
                <span className="px-4 py-2 bg-white rounded-lg border border-neutral-200 text-sm text-neutral-700 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer">
                  À Propos
                </span>
              </Link>
              <Link href="/#activities">
                <span className="px-4 py-2 bg-white rounded-lg border border-neutral-200 text-sm text-neutral-700 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer">
                  Actualités
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}