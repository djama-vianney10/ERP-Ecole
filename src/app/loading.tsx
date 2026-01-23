/**
 * Fichier : src/app/loading.tsx
 * Rôle : Composant de chargement global avec animation moderne
 * Architecture : Loading state pour Next.js App Router
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animé */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 200,
            damping: 15
          }}
          className="mb-8 inline-block"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-strong"
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>
        </motion.div>

        {/* Texte */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-neutral-900 mb-2"
        >
          Chargement en cours...
        </motion.h2>

        {/* Barre de progression */}
        <div className="w-64 h-2 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="h-full w-1/2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
          />
        </div>

        {/* Points animés */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-primary-500 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}