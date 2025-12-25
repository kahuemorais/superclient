import { Link } from 'wouter';
import { breadcrumbLink, breadcrumbText } from './breadcrumbRow.css';

export interface BreadcrumbLinkProps {
  href: string;
  children: React.ReactNode;
}

export function BreadcrumbLink({ href, children }: BreadcrumbLinkProps) {
  return (
    <Link href={href} className={breadcrumbLink}>
      {children}
    </Link>
  );
}

export interface BreadcrumbTextProps {
  children: React.ReactNode;
}

export function BreadcrumbText({ children }: BreadcrumbTextProps) {
  return <span className={breadcrumbText}>{children}</span>;
}
