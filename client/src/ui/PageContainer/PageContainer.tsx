import type { ReactNode } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useBreadcrumb } from '../../contexts/BreadcrumbContext';

export interface PageContainerProps {
  children: ReactNode;
  breadcrumbSlot?: ReactNode;
  actionsSlot?: ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageContainer({ children, breadcrumbSlot, actionsSlot, title, subtitle }: PageContainerProps) {
  const breadcrumbContext = useBreadcrumb();
  const effectiveBreadcrumb = breadcrumbSlot || breadcrumbContext?.breadcrumbComponent;
  
  return (
    <Container maxWidth="lg" sx={{ py: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
      {(effectiveBreadcrumb || actionsSlot) && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          {effectiveBreadcrumb && <Box>{effectiveBreadcrumb}</Box>}
          {actionsSlot && <Stack direction="row" spacing={1}>{actionsSlot}</Stack>}
        </Stack>
      )}
      {(title || subtitle) && (
        <Box sx={{ mb: 3 }}>
          {title && <Typography variant="h4" component="h1">{title}</Typography>}
          {subtitle && <Typography variant="body1" color="text.secondary">{subtitle}</Typography>}
        </Box>
      )}
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Container>
  );
}
