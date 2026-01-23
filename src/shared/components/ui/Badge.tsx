/**
 * Fichier : src/shared/components/ui/Badge.tsx
 * Rôle : Composant badge pour statuts et compteurs
 * Architecture : Design System - Composant de status
 */

'use client'

import React from 'react'
import { cn } from '@/shared/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  const dotColors = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-neutral-500',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])}
        />
      )}
      {children}
    </span>
  )
}

interface NotificationBadgeProps {
  count: number
  max?: number
  show?: boolean
  className?: string
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  show = true,
  className,
}) => {
  if (!show || count === 0) return null

  const displayCount = count > max ? `${max}+` : count.toString()

  return (
    <span
      className={cn(
        'absolute -top-1 -right-1 flex items-center justify-center',
        'min-w-[20px] h-5 px-1.5 rounded-full',
        'bg-red-500 text-white text-xs font-bold',
        'ring-2 ring-white',
        className
      )}
    >
      {displayCount}
    </span>
  )
}