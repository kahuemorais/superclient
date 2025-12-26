import type { ReactNode, HTMLAttributes } from 'react';
import { Box } from '@mui/material';

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'default' | 'compact';
  interactive?: boolean;
}

export function CardSection({ 
  children, 
  size = 'default',
  interactive = false,
  ...rest
}: CardSectionProps) {
  return (
    <Box
      sx={{
        p: size === 'compact' ? 1 : 2,
        cursor: interactive ? 'pointer' : undefined,
        '&:hover': interactive ? { bgcolor: 'action.hover' } : undefined,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
