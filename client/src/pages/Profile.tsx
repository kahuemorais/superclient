import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

export default function Profile() {
  const [preferences, setPreferences] = useState({
    email: true,
    singleSession: false,
  });

  return (
    <Box sx={{ maxWidth: 980, mx: "auto" }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4">Perfil</Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Atualize seus dados e preferencias pessoais.
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(15, 23, 32, 0.9)",
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h6">Dados principais</Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField label="Nome completo" fullWidth defaultValue="Ana Lima" />
              <TextField label="Email" fullWidth defaultValue="ana@empresa.com" />
              <TextField label="Telefone" fullWidth defaultValue="+55 11 99999-1234" />
              <TextField label="Time" fullWidth defaultValue="Operacoes" />
              <TextField label="Cargo" fullWidth defaultValue="Gerente de Conta" />
              <TextField label="Fuso horario" fullWidth defaultValue="America/Sao_Paulo" />
            </Box>
            <Button variant="outlined" size="large" sx={{ alignSelf: "flex-start" }}>
              Salvar alteracoes
            </Button>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(15, 23, 32, 0.9)",
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h6">Seguranca</Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField label="Senha atual" type="password" fullWidth />
              <TextField label="Nova senha" type="password" fullWidth />
            </Box>
            <Button variant="outlined" size="large" sx={{ alignSelf: "flex-start" }}>
              Atualizar senha
            </Button>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(15, 23, 32, 0.9)",
          }}
        >
          <Stack spacing={2.5}>
            <Typography variant="h6">Preferencias</Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Paper
                elevation={0}
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, email: !prev.email }))
                }
                sx={{
                  p: 2.5,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background:
                    "linear-gradient(135deg, rgba(15, 23, 32, 0.9), rgba(34, 201, 166, 0.08))",
                  cursor: "pointer",
                }}
              >
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Notificacoes por email
                    </Typography>
                    <Switch
                      checked={preferences.email}
                      onChange={(event) =>
                        setPreferences((prev) => ({
                          ...prev,
                          email: event.target.checked,
                        }))
                      }
                      onClick={(event) => event.stopPropagation()}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Receba alertas sobre acessos e convites.
                  </Typography>
                </Stack>
              </Paper>
              <Paper
                elevation={0}
                onClick={() =>
                  setPreferences((prev) => ({
                    ...prev,
                    singleSession: !prev.singleSession,
                  }))
                }
                sx={{
                  p: 2.5,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background:
                    "linear-gradient(135deg, rgba(15, 23, 32, 0.9), rgba(34, 201, 166, 0.08))",
                  cursor: "pointer",
                }}
              >
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Sessao unica
                    </Typography>
                    <Switch
                      checked={preferences.singleSession}
                      onChange={(event) =>
                        setPreferences((prev) => ({
                          ...prev,
                          singleSession: event.target.checked,
                        }))
                      }
                      onClick={(event) => event.stopPropagation()}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Desconecte outras sessoes ao entrar novamente.
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
