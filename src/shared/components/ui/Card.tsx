'use client'

import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

// ----- Card Props -----
interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// ----- Card Component -----
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', children, ...props }, ref) => {
    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }

    return (
      <motion.div
        ref={ref}
        whileHover={
          hover ? { y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } : undefined
        }
        className={cn(
          'bg-white rounded-xl border border-neutral-200 shadow-soft',
          paddingStyles[padding],
          hover && 'cursor-pointer transition-shadow',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

// ----- CardHeader Props -----
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: React.ReactNode
}

// ----- CardHeader Component -----
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
        {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
        {description && <p className="text-sm text-neutral-600 mt-1">{description}</p>}
        {children}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  )
}
