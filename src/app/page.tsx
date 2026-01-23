/**
 * Fichier : src/app/page.tsx
 * Rôle : Page d'accueil publique avec design moderne et animations spectaculaires
 * Architecture : Landing page avec sections multiples et navigation fluide
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  TrendingUp,
  Users,
  BookOpen,
  Trophy,
  Star,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Target,
  Heart,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import Button from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const { scrollY } = useScroll()
  
  // Parallax effect pour le hero
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  // Détection de la section active pour la navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'activities', 'top-students', 'stats']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Données mockées
  const upcomingEvents = [
    {
      id: 1,
      title: 'Composition Trimestre 2',
      date: '22-26 Janvier 2025',
      type: 'exam',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 2,
      title: 'Vacances Scolaires',
      date: '15 Février - 2 Mars 2025',
      type: 'holiday',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 3,
      title: 'Journée Portes Ouvertes',
      date: '28 Janvier 2025',
      type: 'event',
      color: 'from-blue-500 to-cyan-500'
    },
  ]

  const topStudents = [
    {
      id: 1,
      name: 'Aya Koné',
      class: '3ème A',
      average: 18.5,
      rank: 1,
      avatar: '🏆',
    },
    {
      id: 2,
      name: 'Yao Kouamé',
      class: '6ème A',
      average: 17.8,
      rank: 2,
      avatar: '🥈',
    },
    {
      id: 3,
      name: 'Adjoua Koffi',
      class: 'Terminale C',
      average: 17.2,
      rank: 3,
      avatar: '🥉',
    },
  ]

  const stats = [
    { label: 'Élèves Inscrits', value: '845+', icon: Users, color: 'from-primary-500 to-orange-500' },
    { label: 'Enseignants Qualifiés', value: '42', icon: GraduationCap, color: 'from-secondary-500 to-green-500' },
    { label: 'Taux de Réussite', value: '94%', icon: Trophy, color: 'from-accent-500 to-yellow-500' },
    { label: 'Classes Actives', value: '28', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
  ]

  const features = [
    {
      icon: Target,
      title: 'Excellence Académique',
      description: 'Formation de qualité conforme au programme ivoirien avec suivi personnalisé',
      color: 'bg-primary-50 text-primary-600',
    },
    {
      icon: Heart,
      title: 'Environnement Bienveillant',
      description: 'Cadre chaleureux favorisant l\'épanouissement et la confiance en soi',
      color: 'bg-secondary-50 text-secondary-600',
    },
    {
      icon: Zap,
      title: 'Innovation Pédagogique',
      description: 'Méthodes modernes et outils numériques pour un apprentissage efficace',
      color: 'bg-accent-50 text-accent-600',
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Floating Navbar Moderne */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              'mt-4 rounded-2xl backdrop-blur-lg border shadow-strong transition-all',
              scrollY.get() > 50
                ? 'bg-white/80 border-neutral-200'
                : 'bg-white/60 border-white/20'
            )}
          >
            <div className="flex items-center justify-between h-16 px-6">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <GraduationCap className="w-6 h-6 text-white" />
                </motion.div>
                <div className="hidden sm:block">
                  <span className="font-bold text-xl text-neutral-900">ERP Scolaire</span>
                  <p className="text-xs text-neutral-600">Excellence & Innovation</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {[
                  { id: 'hero', label: 'Accueil' },
                  { id: 'about', label: 'À Propos' },
                  { id: 'activities', label: 'Actualités' },
                  { id: 'top-students', label: 'Excellence' },
                ].map((item) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      activeSection === item.id
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    )}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Commencer
                  </Button>
                </Link>
                
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mx-4 mt-2 p-4 bg-white rounded-2xl shadow-strong border border-neutral-200"
          >
            {['Accueil', 'À Propos', 'Actualités', 'Excellence'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section - Spectaculaire */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background Gradient Animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        
        {/* Animated Circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 -left-20 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              style={{ y: heroY, opacity: heroOpacity }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-medium mb-6"
              >
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span className="text-sm font-medium text-neutral-700">
                  Système de Gestion Éducative
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6"
              >
                <span className="text-gradient">Excellence</span>
                <br />
                <span className="text-neutral-900">& Innovation</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-neutral-600 mb-8 max-w-2xl"
              >
                Plateforme moderne de gestion scolaire pour les établissements d'excellence en Côte d'Ivoire. Suivi en temps réel, notifications instantanées et outils pédagogiques innovants.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/login">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="gradient-primary text-white shadow-strong"
                  >
                    Accéder à la Plateforme
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  En Savoir Plus
                </Button>
              </motion.div>

              {/* Stats Mini */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-8 mt-12 justify-center lg:justify-start"
              >
                <div>
                  <p className="text-3xl font-bold text-primary-600">845+</p>
                  <p className="text-sm text-neutral-600">Élèves</p>
                </div>
                <div className="w-px h-12 bg-neutral-200" />
                <div>
                  <p className="text-3xl font-bold text-secondary-600">94%</p>
                  <p className="text-sm text-neutral-600">Réussite</p>
                </div>
                <div className="w-px h-12 bg-neutral-200" />
                <div>
                  <p className="text-3xl font-bold text-accent-600">42</p>
                  <p className="text-sm text-neutral-600">Enseignants</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - 3D Card Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative"
              >
                {/* Mockup Dashboard */}
                <div className="bg-white rounded-2xl shadow-strong p-6 border border-neutral-200">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-8 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-lg animate-pulse" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-primary-50 rounded-lg p-4">
                        <Award className="w-6 h-6 text-primary-500 mb-2" />
                        <div className="h-4 bg-primary-200 rounded w-3/4" />
                      </div>
                      <div className="h-24 bg-secondary-50 rounded-lg p-4">
                        <TrendingUp className="w-6 h-6 text-secondary-500 mb-2" />
                        <div className="h-4 bg-secondary-200 rounded w-3/4" />
                      </div>
                    </div>
                    <div className="h-32 bg-neutral-50 rounded-lg" />
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-white rounded-xl shadow-medium p-4"
                >
                  <Star className="w-8 h-8 text-accent-500" />
                </motion.div>

                <motion.div
                  animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-medium p-4"
                >
                  <Trophy className="w-8 h-8 text-primary-500" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-neutral-400 cursor-pointer"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-sm">Défiler</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section - Nos Valeurs */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="primary" className="mb-4">Nos Valeurs</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Pourquoi Nous Choisir ?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Un environnement d'apprentissage moderne qui prépare nos élèves aux défis de demain
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card hover padding="lg" className="h-full">
                  <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-6', feature.color)}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities & Events Section */}
      <section id="activities" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="info" className="mb-4">Actualités</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Événements à Venir
            </h2>
            <p className="text-xl text-neutral-600">
              Restez informés des dates importantes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
              >
                <Card padding="none" className="overflow-hidden h-full">
                  <div className={cn('h-32 bg-gradient-to-br', event.color, 'flex items-center justify-center')}>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <Calendar className="w-16 h-16 text-white" />
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <Badge
                      variant={
                        event.type === 'exam' ? 'error' :
                        event.type === 'holiday' ? 'success' :
                        'info'
                      }
                      className="mb-3"
                    >
                      {event.type === 'exam' ? 'Examen' : event.type === 'holiday' ? 'Vacances' : 'Événement'}
                    </Badge>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-neutral-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Students Section - Excellence */}
      <section id="top-students" className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="warning" className="mb-4">Excellence</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Nos Meilleurs Élèves
            </h2>
            <p className="text-xl text-neutral-600">
              Célébrons la réussite et l'excellence académique
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {topStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotate: index === 0 ? -2 : index === 1 ? 0 : 2 }}
              >
                <Card
                  padding="lg"
                  className={cn(
                    'text-center relative overflow-hidden',
                    student.rank === 1 && 'ring-4 ring-accent-500 shadow-strong'
                  )}
                >
                  {student.rank === 1 && (
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                      className="absolute -top-20 -right-20 w-40 h-40 bg-accent-200 rounded-full blur-3xl opacity-30"
                    />
                  )}

                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl mb-4"
                    >
                      {student.avatar}
                    </motion.div>

                    <div className={cn(
                      'inline-flex items-center justify-center w-12 h-12 rounded-full mb-4',
                      student.rank === 1 ? 'bg-accent-100 text-accent-700' :
                      student.rank === 2 ? 'bg-neutral-200 text-neutral-700' :
                      'bg-orange-100 text-orange-700'
                    )}>
                      <span className="text-lg font-bold">#{student.rank}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                      {student.name}
                    </h3>
                    <Badge variant="neutral" className="mb-4">
                      {student.class}
                    </Badge>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-accent-500 fill-accent-500" />
                      <span className="text-3xl font-bold text-gradient">
                        {student.average}/20
                      </span>
                    </div>

                    <p className="text-sm text-neutral-600">
                      Moyenne Générale
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-lg text-neutral-600 mb-6">
              Vous aussi, visez l'excellence !
            </p>
            <Link href="/login">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<Sparkles className="w-5 h-5" />}
                className="gradient-primary shadow-strong"
              >
                Rejoindre la Plateforme
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-neutral-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(249, 115, 22, 0.3) 50%, transparent 60%)',
            backgroundSize: '200% 200%',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              L'Excellence en Chiffres
            </h2>
            <p className="text-xl text-neutral-400">
              Des résultats qui parlent d'eux-mêmes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className={cn('bg-gradient-to-br p-8 rounded-2xl', stat.color)}>
                  <stat.icon className="w-12 h-12 text-white mb-4" />
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-5xl font-bold mb-2"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-white/80 text-lg">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 relative overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-16 h-16 text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à Commencer ?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté d'excellence et transformez votre expérience éducative dès aujourd'hui
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button
                  variant="secondary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="bg-white text-primary-600 hover:bg-neutral-50 shadow-strong"
                >
                  Accéder à la Plateforme
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-lg">ERP Scolaire</span>
              </div>
              <p className="text-neutral-400 text-sm">
                Excellence & Innovation pour l'éducation en Côte d'Ivoire
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><a href="#hero" className="hover:text-white transition-colors">Accueil</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">À Propos</a></li>
                <li><a href="#activities" className="hover:text-white transition-colors">Actualités</a></li>
                <li><a href="#top-students" className="hover:text-white transition-colors">Excellence</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><Link href="/login" className="hover:text-white transition-colors">Connexion</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li>Abidjan, Cocody</li>
                <li>Côte d'Ivoire</li>
                <li>contact@erp-scolaire.ci</li>
                <li>+225 07 XX XX XX XX</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8">
            <p className="text-center text-neutral-400 text-sm">
              © 2024 ERP Scolaire CI. Tous droits réservés. Développé avec ❤️ pour l'éducation
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}