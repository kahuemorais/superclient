import {
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "wouter";
import PageContainer from "../components/layout/PageContainer";
import PageStack from "../components/layout/PageStack";
import AppAccordion from "../components/layout/AppAccordion";

const faqItems = [
  {
    title: "Login e recuperação de senha",
    content:
      "Faça login com email e senha. Se precisar criar um acesso novo, use Criar conta. Se a opção de recuperação estiver disponível na sua tela, siga o fluxo para receber o link no email.",
  },
  {
    title: "Criação de conta",
    content:
      "Crie seu workspace com nome, email e senha. Após criar, você já entra e começa com dados de exemplo para testar o fluxo (contatos, tarefas, notas e categorias).",
  },
  {
    title: "Home (dashboard)",
    content:
      "Mostra uma visão geral do pipeline, finanças, agenda e gestão com indicadores e atalhos para você agir rápido.",
  },
  {
    title: "Calendário",
    content:
      "Organize tarefas e lembretes por dia, selecione calendários ativos e ajuste detalhes como horário, local e repetição.",
  },
  {
    title: "Pipeline",
    content:
      "Organize oportunidades/tarefas em colunas, arraste cards entre etapas e foque no próximo passo. Categorias e filtros ajudam a encontrar o que importa rápido.",
  },
  {
    title: "Dados da pipeline",
    content:
      "Painel com métricas por etapa e gráficos. As métricas de valor aparecem quando o campo de valor está ativo.",
  },
  {
    title: "Finanças",
    content:
      "Registre entradas e saídas, filtre por categorias e visualize gráficos. Ao clicar em um item, você abre os detalhes e pode editar.",
  },
  {
    title: "Categorias (pipeline, financas e contatos)",
    content:
      "Cada área tem suas próprias categorias (incluindo o calendário). Você pode criar, editar cor/nome e remover categorias.",
  },
  {
    title: "Contatos",
    content:
      "Cadastre pessoas com múltiplos telefones, emails, endereços e comentários. Copie dados com um clique e organize por categorias.",
  },
  {
    title: "Notificações",
    content:
      "Mostra alertas (ex.: aniversários próximos) e permite marcar como visto. O sino indica quando há novidades.",
  },
  {
    title: "Idiomas",
    content:
      "Altere o idioma em Perfil. O app confirma a troca e permite desfazer a alteração.",
  },
  {
    title: "Gestão de acessos",
    content:
      "Controle papéis, permissões e módulos pagos. Edite permissões por papel e ative/desative módulos.",
  },
  {
    title: "Perfil",
    content:
      "Atualize dados pessoais, emails de login adicionais, preferências e idioma. Em trocar de conta, selecione contas recentes ou faça login em outra.",
  },
  {
    title: "Sessão e segurança",
    content:
      "A sessão dura 1 semana. Ao logar em outro dispositivo, sessões anteriores podem ser encerradas por segurança.",
  },
];

const supportCategories = [
  { value: "duvidas", label: "Dúvidas" },
  { value: "sugestoes", label: "Sugestões" },
  { value: "problemas_financeiros", label: "Problemas financeiros" },
  { value: "suporte_tecnico", label: "Suporte técnico" },
  { value: "cobranca", label: "Cobrança" },
  { value: "outros", label: "Outros" },
];

export default function Support() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | false>(false);
  const [contactExpanded, setContactExpanded] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [supportCategory, setSupportCategory] = useState("duvidas");
  const [supportMessage, setSupportMessage] = useState("");
  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return faqItems;
    }
    return faqItems.filter(item => {
      const haystack = `${item.title} ${item.content}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [query]);

  return (
    <PageContainer>
      <PageStack maxWidth={1200}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Suporte
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Respostas rápidas para você configurar, testar e começar a usar o
            Superclient com segurança.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button component={RouterLink} href="/signup" variant="contained">
              Criar conta
            </Button>
            <Button component={RouterLink} href="/login" variant="outlined">
              Entrar
            </Button>
          </Stack>
        </Stack>

        <TextField
          fullWidth
          label="Buscar dúvida"
          placeholder="Digite uma palavra-chave"
          value={query}
          onChange={event => setQuery(event.target.value)}
          InputProps={{
            endAdornment: query ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setQuery("")}
                  aria-label="Limpar busca"
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <Stack spacing={1.5}>
          {filteredItems.length ? (
            filteredItems.map(item => (
              <AppAccordion
                key={item.title}
                expanded={expanded === item.title}
                onChange={(_, isExpanded) =>
                  setExpanded(isExpanded ? item.title : false)
                }
                title={item.title}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.content}
                </Typography>
              </AppAccordion>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Nenhum artigo encontrado.
            </Typography>
          )}

          <AppAccordion
            expanded={contactExpanded}
            onChange={(_, isExpanded) => setContactExpanded(isExpanded)}
            title="Fale com o suporte"
            subtitle="Descreva o objetivo, o que você tentou e o que aconteceu."
          >
            <Stack spacing={1.5}>
              <TextField
                label="Email para contato"
                fullWidth
                value={supportEmail}
                onChange={event => setSupportEmail(event.target.value)}
              />
              <TextField
                select
                label="Categoria"
                fullWidth
                value={supportCategory}
                onChange={event => setSupportCategory(event.target.value)}
              >
                {supportCategories.map(category => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Mensagem"
                fullWidth
                multiline
                minRows={4}
                value={supportMessage}
                onChange={event => setSupportMessage(event.target.value)}
              />
              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained">Enviar mensagem</Button>
              </Stack>
            </Stack>
          </AppAccordion>
        </Stack>
      </PageStack>
    </PageContainer>
  );
}
