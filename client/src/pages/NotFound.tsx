import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "wouter";

export default function NotFound() {
  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          border: 1,
                      borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Stack spacing={2.5} alignItems="flex-start">
          <Typography variant="overline" sx={{ color: "text.secondary" }}>
            404
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Pagina nao encontrada
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              component={RouterLink}
              href="/login"
              variant="contained"
              size="large"
            >
              Ir para login
            </Button>
            <Button
              component={RouterLink}
              href="/profile"
              variant="outlined"
              size="large"
            >
              Abrir perfil
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
