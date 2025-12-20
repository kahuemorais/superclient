import { useEffect, useMemo, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "wouter";
import api from "../api";

type Deal = {
  id: string;
  value: string;
};

type Column = {
  id: string;
  title: string;
  deals: Deal[];
};

type Expense = {
  id: string;
  amount: number;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
};

type Role = {
  id: number;
  name: string;
  members: number;
};

type Module = {
  id: number;
  name: string;
  enabled: boolean;
};

type Invite = {
  id: number;
  status: string;
};

const parseValue = (value: string) => {
  const normalized = value.replace(/\s/g, "").toLowerCase();
  const numberMatch = normalized.match(/([\d.,]+)/);
  if (!numberMatch) {
    return 0;
  }
  const raw = numberMatch[1].replace(/\./g, "").replace(",", ".");
  const base = Number(raw) || 0;
  const suffix = normalized.match(/([km])/);
  if (!suffix) {
    return base;
  }
  return suffix[1] === "m" ? base * 1_000_000 : base * 1_000;
};

const formatValue = (value: number) => {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1).replace(".0", "")}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(0)}k`;
  }
  return `R$ ${Math.round(value).toLocaleString("pt-BR")}`;
};

export default function Dashboard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/api/pipeline/board");
        const pipeline = response?.data?.pipeline;
        if (Array.isArray(pipeline)) {
          setColumns(pipeline);
        } else if (pipeline?.columns) {
          setColumns(pipeline.columns);
        }
      } catch {
        // Keep empty on failure.
      }
    };
    void load();
  }, []);

  useEffect(() => {
    const loadFinance = async () => {
      try {
        const response = await api.get("/api/finance/data");
        const data = response?.data?.data;
        if (data?.expenses) {
          setExpenses(data.expenses);
        }
        if (data?.categories) {
          setCategories(data.categories);
        }
      } catch {
        // Keep empty on failure.
      }
    };
    void loadFinance();
  }, []);

  useEffect(() => {
    const loadAccess = async () => {
      try {
        const [rolesResponse, modulesResponse, invitesResponse] = await Promise.all([
          api.get("/api/access/roles"),
          api.get("/api/access/modules"),
          api.get("/api/access/invites"),
        ]);
        setRoles(rolesResponse?.data?.roles || []);
        setModules(modulesResponse?.data?.modules || []);
        setInvites(invitesResponse?.data?.invites || []);
      } catch {
        // Keep empty on failure.
      }
    };
    void loadAccess();
  }, []);

  const pipelineSummary = useMemo(() => {
    const totalCount = columns.reduce((sum, column) => sum + column.deals.length, 0);
    const totalValue = columns.reduce(
      (sum, column) =>
        sum + column.deals.reduce((acc, deal) => acc + parseValue(deal.value), 0),
      0
    );
    const avgTicket = totalCount > 0 ? totalValue / totalCount : 0;
    const topStage = columns.reduce<Column | null>((best, column) => {
      const columnValue = column.deals.reduce(
        (acc, deal) => acc + parseValue(deal.value),
        0
      );
      const bestValue = best
        ? best.deals.reduce((acc, deal) => acc + parseValue(deal.value), 0)
        : -1;
      return columnValue > bestValue ? column : best;
    }, null);
    return { totalCount, totalValue, avgTicket, topStage };
  }, [columns]);

  const financeSummary = useMemo(() => {
    const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalsByCategory = new Map<string, number>();
    expenses.forEach((expense) => {
      totalsByCategory.set(
        expense.categoryId,
        (totalsByCategory.get(expense.categoryId) || 0) + expense.amount
      );
    });
    let topCategoryId = "";
    let topCategoryValue = 0;
    totalsByCategory.forEach((value, id) => {
      if (value > topCategoryValue) {
        topCategoryValue = value;
        topCategoryId = id;
      }
    });
    const topCategory = categories.find((cat) => cat.id === topCategoryId);
    return {
      totalSpend,
      topCategory,
      topCategoryValue,
    };
  }, [expenses, categories]);

  const accessSummary = useMemo(() => {
    const rolesCount = roles.length;
    const membersCount = roles.reduce((sum, role) => sum + role.members, 0);
    const enabledModules = modules.filter((module) => module.enabled).length;
    const pendingInvites = invites.filter((invite) => invite.status === "Pendente").length;
    return { rolesCount, membersCount, enabledModules, pendingInvites };
  }, [roles, modules, invites]);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Home
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Visao geral do pipeline, financas e gestao em um unico lugar.
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
          <Stack spacing={2.5}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6">Pipeline</Typography>
              <Button
                component={RouterLink}
                href="/pipeline"
                variant="outlined"
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Ver pipeline
              </Button>
            </Box>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  flex: 1,
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(15, 23, 32, 0.9)",
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  Total de cards
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {pipelineSummary.totalCount}
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  flex: 1,
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(15, 23, 32, 0.9)",
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  Valor total
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {formatValue(pipelineSummary.totalValue)}
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  flex: 1,
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(15, 23, 32, 0.9)",
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  Ticket medio
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {formatValue(pipelineSummary.avgTicket)}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {pipelineSummary.topStage
                    ? `Maior etapa: ${pipelineSummary.topStage.title}`
                    : "Sem dados"}
                </Typography>
              </Paper>
            </Stack>
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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6">Financas</Typography>
              <Button
                component={RouterLink}
                href="/financas"
                variant="outlined"
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Ver financas
              </Button>
            </Box>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  flex: 1,
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(15, 23, 32, 0.9)",
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  Total de gastos
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  R$ {financeSummary.totalSpend.toLocaleString("pt-BR")}
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  flex: 1,
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(15, 23, 32, 0.9)",
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  Categoria em destaque
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {financeSummary.topCategory?.name || "Sem dados"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {financeSummary.topCategory
                    ? `R$ ${financeSummary.topCategoryValue.toLocaleString("pt-BR")} em gastos`
                    : "Sem gastos registrados"}
                </Typography>
              </Paper>
            </Stack>
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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6">Gestao</Typography>
              <Button
                component={RouterLink}
                href="/access"
                variant="outlined"
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Ver gestao
              </Button>
            </Box>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  flex: 1,
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(15, 23, 32, 0.9)",
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  Papeis ativos
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {accessSummary.rolesCount}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {accessSummary.membersCount} membros no total
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  flex: 1,
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(15, 23, 32, 0.9)",
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  Modulos ativos
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {accessSummary.enabledModules}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {accessSummary.pendingInvites} convites pendentes
                </Typography>
              </Paper>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
