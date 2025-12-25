import type { ReactNode } from 'react';
import { pageActionsContainer } from './pageHeader.css';

export interface PageActionsProps {
  children: ReactNode;
}

export function PageActions({ children }: PageActionsProps) {
  return <div className={pageActionsContainer}>{children}</div>;
}
