import { Link } from 'wouter';
import {
  footerContainer,
  footerInner,
  footerCopyright,
  footerLinks,
  footerLink,
} from './footer.css';

export interface FooterLinkItem {
  href: string;
  label: string;
}

export interface FooterProps {
  copyright?: string;
  links?: FooterLinkItem[];
}

export function Footer({ copyright, links = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright || `Superclient © ${currentYear}`;
  
  return (
    <footer className={footerContainer}>
      <div className={footerInner}>
        <div className={footerCopyright}>{copyrightText}</div>
        
        {links.length > 0 && (
          <nav className={footerLinks}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={footerLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
