import type { ReactNode, HTMLAttributes } from 'react';
import {
  cardSection,
  cardSectionInteractive,
  cardSectionCompact,
} from './cardSection.css';

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'default' | 'compact';
  interactive?: boolean;
  className?: string;
}

export function CardSection({ 
  children, 
  size = 'default',
  interactive = false,
  className = '',
  ...rest
}: CardSectionProps) {
  const classes = [
    cardSection,
    size === 'compact' && cardSectionCompact,
    interactive && cardSectionInteractive,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
