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
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          spacing={1.5}
          sx={{ mb: 2, minWidth: 0 }}
        >
          {effectiveBreadcrumb && (
            <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
              {effectiveBreadcrumb}
            </Box>
          )}
          {actionsSlot && (
            <Box
              sx={{
                flex: '0 0 auto',
                minWidth: 0,
                width: { xs: '100%', md: 'auto' },
                display: 'flex',
                justifyContent: { xs: 'stretch', md: 'flex-end' },
              }}
            >
              <Box sx={{ width: { xs: '100%', md: 'auto' }, minWidth: 0 }}>
                {actionsSlot}
              </Box>
            </Box>
          )}
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
