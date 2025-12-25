import type { ReactNode } from 'react';
import {
  breadcrumbRowContainer,
  breadcrumbNav,
  breadcrumbList,
  breadcrumbItem,
  breadcrumbSeparator,
  actionsContainer,
} from './breadcrumbRow.css';

export interface BreadcrumbRowProps {
  breadcrumbItems: ReactNode;
  actions?: ReactNode;
}

export function BreadcrumbRow({ breadcrumbItems, actions }: BreadcrumbRowProps) {
  // Convert breadcrumbItems (array of JSX) into list items with separators
  const items = Array.isArray(breadcrumbItems) ? breadcrumbItems : [breadcrumbItems];
  
  return (
    <div className={breadcrumbRowContainer}>
      <nav aria-label="breadcrumb" className={breadcrumbNav}>
        <ol className={breadcrumbList}>
          {items.map((item, index) => (
            <li key={index} className={breadcrumbItem}>
              {item}
              {index < items.length - 1 && (
                <span className={breadcrumbSeparator} aria-hidden="true">
                  ›
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      {actions && (
        <div className={actionsContainer}>
          {actions}
        </div>
      )}
    </div>
  );
}
