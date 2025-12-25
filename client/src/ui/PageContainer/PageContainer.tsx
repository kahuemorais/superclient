import type { ReactNode } from 'react';
import {
  pageContainer,
  pageHeader,
  pageTitle,
  pageActions,
  pageContent,
} from './pageContainer.css';

export interface PageContainerProps {
  children: ReactNode;
  title?: string;
  actionsSlot?: ReactNode;
}

export function PageContainer({ children, title, actionsSlot }: PageContainerProps) {
  return (
    <div className={pageContainer}>
      {(title || actionsSlot) && (
        <div className={pageHeader}>
          {title && <h1 className={pageTitle}>{title}</h1>}
          {actionsSlot && <div className={pageActions}>{actionsSlot}</div>}
        </div>
      )}
      <div className={pageContent}>{children}</div>
    </div>
  );
}
