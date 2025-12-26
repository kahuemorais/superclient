import type { ReactNode } from 'react';
import { Box, Card as MuiCard, CardContent, CardHeader, Typography } from '@mui/material';

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actionsSlot?: ReactNode;
}

export function Card({ children, title, subtitle, actionsSlot }: CardProps) {
  const hasHeader = title || subtitle || actionsSlot;

  return (
    <MuiCard>
      {hasHeader && (
        <CardHeader
          title={title && <Typography variant="h6">{title}</Typography>}
          subheader={subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
          action={actionsSlot && <Box>{actionsSlot}</Box>}
        />
      )}
      <CardContent>
        {children}
      </CardContent>
    </MuiCard>
  );
}
