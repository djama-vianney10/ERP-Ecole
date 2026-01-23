/**
 * Fichier : src/shared/components/ui/Card.tsx
 * Rôle : Composant carte pour conteneurs de contenu
 * Architecture : Design System - Composant UI conteneur
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', children, ...props }, ref) => {
    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }

    const Component = hover ? motion.div : 'div'
    const hoverProps = hover
      ? { whileHover: { y: -2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' } }
      : {}

    return (
      <Component
        ref={ref}
        className={cn(
          'bg-white rounded-xl border border-neutral-200 shadow-soft',
          paddingStyles[padding],
          hover && 'cursor-pointer transition-shadow',
          className
        )}
        {...hoverProps}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  action,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('flex items-start justify-between mb-4', className)}
      {...props}
    >
      <div className="flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-neutral-600 mt-1">{description}</p>
        )}
        {children}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  )
}

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return <div className={cn('', className)} {...props} />
}

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex items-center justify-end gap-2 mt-4 pt-4 border-t border-neutral-200', className)}
      {...props}
    />
  )
}