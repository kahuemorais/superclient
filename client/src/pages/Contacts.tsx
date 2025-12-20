import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";

type Contact = {
  id: string;
  name: string;
  birthday: string;
  phones: string[];
  emails: string[];
  addresses: string[];
  comments: string[];
};

const STORAGE_KEY = "contacts_v1";

const emptyContact = (): Contact => ({
  id: `contact-${Date.now()}`,
  name: "",
  birthday: "",
  phones: [""],
  emails: [""],
  addresses: [""],
  comments: [""],
});

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactForm, setContactForm] = useState<Contact | null>(null);
  const isLoadedRef = useRef(false);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      isLoadedRef.current = true;
      return;
    }
    try {
      const parsed = JSON.parse(stored) as Contact[];
      if (Array.isArray(parsed)) {
        setContacts(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      isLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!isLoadedRef.current) {
      return;
    }
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
      window.dispatchEvent(new Event("contacts-change"));
    }, 300);
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [contacts]);

  const openNewContact = () => {
    const next = emptyContact();
    setSelectedContact(null);
    setEditingContact(next);
    setContactForm(next);
  };

  const openContact = (contact: Contact) => {
    setSelectedContact(contact);
    setEditingContact(null);
    setContactForm(null);
  };

  const updateListField = (key: "phones" | "emails" | "addresses" | "comments", index: number, value: string) => {
    setContactForm((prev) => {
      if (!prev) {
        return prev;
      }
      const next = { ...prev };
      const list = [...next[key]];
      list[index] = value;
      next[key] = list;
      return next;
    });
  };

  const sanitizePhone = (value: string) => value.replace(/\D/g, "");

  const addListField = (key: "phones" | "emails" | "addresses" | "comments") => {
    setContactForm((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, [key]: [...prev[key], ""] };
    });
  };

  const removeListField = (key: "phones" | "emails" | "addresses" | "comments", index: number) => {
    setContactForm((prev) => {
      if (!prev) {
        return prev;
      }
      const list = prev[key].filter((_, idx) => idx !== index);
      return { ...prev, [key]: list.length ? list : [""] };
    });
  };

  const hasContactContent = (contact: Contact) => {
    if (contact.name.trim() || contact.birthday) {
      return true;
    }
    if (contact.phones.some((phone) => phone.trim())) {
      return true;
    }
    if (contact.emails.some((email) => email.trim())) {
      return true;
    }
    if (contact.addresses.some((address) => address.trim())) {
      return true;
    }
    if (contact.comments.some((comment) => comment.trim())) {
      return true;
    }
    return false;
  };

  const removeContact = () => {
    if (!editingContact) {
      return;
    }
    setContacts((prev) => prev.filter((item) => item.id !== editingContact.id));
    setEditingContact(null);
    setContactForm(null);
  };

  const saveContact = () => {
    if (!contactForm) {
      return;
    }
    setContacts((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === contactForm.id);
      if (existingIndex === -1) {
        return [contactForm, ...prev];
      }
      const next = [...prev];
      next[existingIndex] = contactForm;
      return next;
    });
    setEditingContact(null);
    setContactForm(null);
  };

  useEffect(() => {
    if (!contactForm) {
      return;
    }
    if (!hasContactContent(contactForm)) {
      return;
    }
    setContacts((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === contactForm.id);
      if (existingIndex === -1) {
        return [contactForm, ...prev];
      }
      const next = [...prev];
      next[existingIndex] = contactForm;
      return next;
    });
  }, [contactForm]);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      <Stack spacing={3}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Contatos
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Organize pessoas, telefones, emails e enderecos em um unico lugar.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={openNewContact}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Adicionar contato
          </Button>
        </Box>

        {contacts.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundColor: "rgba(15, 23, 32, 0.85)",
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Nenhum contato cadastrado ainda.
            </Typography>
          </Paper>
        ) : (
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} flexWrap="wrap" useFlexGap>
            {contacts.map((contact) => (
              <Paper
                key={contact.id}
                elevation={0}
                onClick={() => openContact(contact)}
                sx={{
                  p: 2.5,
                  minWidth: 260,
                  flex: 1,
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(15, 23, 32, 0.9)",
                  cursor: "pointer",
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {contact.name || "Sem nome"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {contact.phones.filter(Boolean).length} telefones
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {contact.emails.filter(Boolean).length} emails
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {contact.addresses.filter(Boolean).length} enderecos
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>

      <Dialog open={Boolean(selectedContact)} onClose={() => setSelectedContact(null)} maxWidth="sm" fullWidth>
        <DialogContent>
          <Stack spacing={2.5}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6">
                {selectedContact?.name || "Contato"}
              </Typography>
              <IconButton onClick={() => setSelectedContact(null)} sx={{ color: "text.secondary" }}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Aniversario
              </Typography>
              {selectedContact?.birthday ? (
                <Typography variant="body2">
                  {new Date(selectedContact.birthday).toLocaleDateString("pt-BR")}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Nao informado.
                </Typography>
              )}
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Aniversario
              </Typography>
              {selectedContact?.birthday ? (
                <Typography variant="body2">
                  {new Date(selectedContact.birthday).toLocaleDateString("pt-BR")}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Nao informado.
                </Typography>
              )}
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Telefones
              </Typography>
              {selectedContact?.phones.filter(Boolean).length ? (
                selectedContact?.phones.filter(Boolean).map((phone, index) => (
                  <Typography key={`view-phone-${index}`} variant="body2">
                    {phone}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Nenhum telefone informado.
                </Typography>
              )}
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Emails
              </Typography>
              {selectedContact?.emails.filter(Boolean).length ? (
                selectedContact?.emails.filter(Boolean).map((email, index) => (
                  <Typography key={`view-email-${index}`} variant="body2">
                    {email}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Nenhum email informado.
                </Typography>
              )}
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Enderecos
              </Typography>
              {selectedContact?.addresses.filter(Boolean).length ? (
                selectedContact?.addresses.filter(Boolean).map((address, index) => (
                  <Stack key={`view-address-${index}`} direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">{address}</Typography>
                    <IconButton
                      component="a"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      <LinkRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Nenhum endereco informado.
                </Typography>
              )}
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Comentarios
              </Typography>
              {selectedContact?.comments.filter(Boolean).length ? (
                selectedContact?.comments.filter(Boolean).map((comment, index) => (
                  <Typography key={`view-comment-${index}`} variant="body2">
                    {comment}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Nenhum comentario informado.
                </Typography>
              )}
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => {
                  if (!selectedContact) {
                    return;
                  }
                  setEditingContact(selectedContact);
                  setContactForm({ ...selectedContact });
                  setSelectedContact(null);
                }}
              >
                Editar
              </Button>
              <Button variant="contained" onClick={() => setSelectedContact(null)}>
                Fechar
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingContact)} onClose={() => setEditingContact(null)} maxWidth="sm" fullWidth>
        <DialogContent>
          <Stack spacing={2.5}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6">
                {editingContact?.name ? `Editar ${editingContact.name}` : "Novo contato"}
              </Typography>
              <IconButton onClick={() => setEditingContact(null)} sx={{ color: "text.secondary" }}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
            <TextField
              label="Nome"
              fullWidth
              value={contactForm?.name || ""}
              onChange={(event) =>
                setContactForm((prev) => (prev ? { ...prev, name: event.target.value } : prev))
              }
            />
            <TextField
              label="Data de aniversario"
              type="date"
              fullWidth
              value={contactForm?.birthday || ""}
              onChange={(event) =>
                setContactForm((prev) =>
                  prev ? { ...prev, birthday: event.target.value } : prev
                )
              }
              InputLabelProps={{ shrink: true }}
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Telefones
              </Typography>
              {contactForm?.phones.map((phone, index) => (
                <Stack key={`phone-${index}`} direction="row" spacing={1} alignItems="center">
                  <TextField
                    label={`Telefone ${index + 1}`}
                    fullWidth
                    value={phone}
                    onChange={(event) =>
                      updateListField("phones", index, sanitizePhone(event.target.value))
                    }
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  />
                  <IconButton onClick={() => removeListField("phones", index)}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => addListField("phones")}
                sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600 }}
              >
                Adicionar telefone
              </Button>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Emails
              </Typography>
              {contactForm?.emails.map((email, index) => (
                <Stack key={`email-${index}`} direction="row" spacing={1} alignItems="center">
                  <TextField
                    label={`Email ${index + 1}`}
                    fullWidth
                    value={email}
                    onChange={(event) => updateListField("emails", index, event.target.value)}
                  />
                  <IconButton onClick={() => removeListField("emails", index)}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => addListField("emails")}
                sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600 }}
              >
                Adicionar email
              </Button>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Enderecos
              </Typography>
              {contactForm?.addresses.map((address, index) => (
                <Stack key={`address-${index}`} direction="row" spacing={1} alignItems="center">
                  <TextField
                    label={`Endereco ${index + 1}`}
                    fullWidth
                    value={address}
                    onChange={(event) => updateListField("addresses", index, event.target.value)}
                  />
                  <IconButton
                    component="a"
                    href={
                      address
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
                        : undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    disabled={!address}
                  >
                    <LinkRoundedIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => removeListField("addresses", index)}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => addListField("addresses")}
                sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600 }}
              >
                Adicionar endereco
              </Button>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Comentarios
              </Typography>
              {contactForm?.comments.map((comment, index) => (
                <Stack key={`comment-${index}`} direction="row" spacing={1} alignItems="center">
                  <TextField
                    label={`Comentario ${index + 1}`}
                    fullWidth
                    multiline
                    minRows={2}
                    value={comment}
                    onChange={(event) => updateListField("comments", index, event.target.value)}
                  />
                  <IconButton onClick={() => removeListField("comments", index)}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => addListField("comments")}
                sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600 }}
              >
                Adicionar comentario
              </Button>
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button color="error" variant="outlined" onClick={removeContact}>
                Remover
              </Button>
              <Button variant="outlined" onClick={() => setEditingContact(null)}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={saveContact}>
                Salvar
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
