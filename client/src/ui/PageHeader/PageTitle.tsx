import type { ReactNode } from 'react';
import { pageTitleContainer, pageTitle, pageSubtitle } from './pageHeader.css';

export interface PageTitleProps {
  children: ReactNode;
  subtitle?: string;
}

export function PageTitle({ children, subtitle }: PageTitleProps) {
  return (
    <div className={pageTitleContainer}>
      <h1 className={pageTitle}>{children}</h1>
      {subtitle && <p className={pageSubtitle}>{subtitle}</p>}
    </div>
  );
}
