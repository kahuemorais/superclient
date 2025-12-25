import type { ReactNode } from 'react';
import {
  card,
  cardHeader,
  cardHeaderContent,
  cardTitle,
  cardSubtitle,
  cardActions,
  cardContent,
} from './card.css';

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actionsSlot?: ReactNode;
  className?: string;
}

export function Card({ children, title, subtitle, actionsSlot, className }: CardProps) {
  const hasHeader = title || subtitle || actionsSlot;

  return (
    <div className={`${card} ${className || ''}`}>
      {hasHeader && (
        <div className={cardHeader}>
          <div className={cardHeaderContent}>
            {title && <h2 className={cardTitle}>{title}</h2>}
            {subtitle && <p className={cardSubtitle}>{subtitle}</p>}
          </div>
          {actionsSlot && (
            <div className={cardActions}>
              {actionsSlot}
            </div>
          )}
        </div>
      )}
      <div className={cardContent}>
        {children}
      </div>
    </div>
  );
}
