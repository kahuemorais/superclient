import { useEffect, useMemo, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

type Contact = {
  id: string;
  name: string;
  birthday?: string;
};

const STORAGE_KEY = "contacts_v1";
const SEEN_KEY = "notifications_seen_at";

const getUpcomingBirthdays = (contacts: Contact[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return contacts
    .filter(contact => contact.birthday)
    .map(contact => {
      const [year, month, day] = String(contact.birthday)
        .split("-")
        .map(Number);
      if (!month || !day) {
        return null;
      }
      const next = new Date(today.getFullYear(), month - 1, day);
      if (next < today) {
        next.setFullYear(today.getFullYear() + 1);
      }
      const diffDays = Math.round(
        (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return { contact, next, diffDays };
    })
    .filter(
      (item): item is { contact: Contact; next: Date; diffDays: number } =>
        Boolean(item)
    )
    .filter(item => item.diffDays >= 0 && item.diffDays <= 7)
    .sort((a, b) => a.diffDays - b.diffDays);
};

export default function Notifications() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }
    try {
      const parsed = JSON.parse(stored) as Contact[];
      if (Array.isArray(parsed)) {
        setContacts(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const upcoming = useMemo(() => getUpcomingBirthdays(contacts), [contacts]);

  const markAsSeen = () => {
    window.localStorage.setItem(SEEN_KEY, new Date().toISOString());
    window.dispatchEvent(new Event("contacts-change"));
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Notificações
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            border: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Stack spacing={2.5}>
            <Typography variant="h6">Aniversários da semana</Typography>
            {upcoming.length === 0 ? (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Nenhum aniversario nos proximos dias.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {upcoming.map(item => (
                  <Paper
                    key={item.contact.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "divider",
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {item.contact.name || "Contato sem nome"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {item.next.toLocaleDateString("pt-BR")} · em{" "}
                      {item.diffDays} dia(s)
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            )}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="flex-end"
            >
              <Button variant="outlined" onClick={markAsSeen}>
                Marcar como visto
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
