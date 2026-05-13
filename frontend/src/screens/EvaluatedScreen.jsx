import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Skeleton,
  Tabs,
  Tab,
  Fade,
} from "@mui/material";
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { evaluatedService } from "../services/evaluatedService";
import EvaluatedCard from "../components/EvaluatedCard";
import EvaluatedForm from "../components/EvaluatedForm";
import EvaluatedEditForm from "../components/EvaluatedEditForm";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "../context/SnackbarContext";

const EvaluatedScreen = () => {
  const [evaluatedList, setEvaluatedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingEvaluated, setEditingEvaluated] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    loadEvaluated();
  }, []);

  const loadEvaluated = async () => {
    try {
      setLoading(true);
      const data = await evaluatedService.getAllEvaluated();
      setEvaluatedList(data);
    } catch (error) {
      showError("Error al cargar los evaluados: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvaluated = async (evaluatedData) => {
    try {
      await evaluatedService.registerEvaluated(evaluatedData);
      await loadEvaluated();
      showSuccess("Evaluado agregado correctamente.");
    } catch (error) {
      showError("Error al agregar evaluado: " + error.message);
    }
  };

  const handleUpdateEvaluated = (updatedEvaluated) => {
    setEvaluatedList((prev) =>
      prev.map((e) => (e.id === updatedEvaluated.id ? { ...e, ...updatedEvaluated } : e))
    );
    showSuccess("Evaluado actualizado correctamente.");
  };

  const handleDeleteEvaluated = async (evaluatedId) => {
    try {
      await evaluatedService.deleteEvaluated(evaluatedId);
      await loadEvaluated();
      showSuccess("Evaluado eliminado correctamente.");
    } catch (error) {
      showError("Error al eliminar evaluado: " + error.message);
    }
  };

  const patients = evaluatedList.filter(
    (e) => e.evaluatedTypeName?.toLowerCase() === "pacientes",
  );
  const controls = evaluatedList.filter(
    (e) => e.evaluatedTypeName?.toLowerCase() === "controles",
  );

  const tabItems = [
    { label: "Todos", list: evaluatedList, color: "#1B4F8A" },
    { label: "Pacientes", list: patients, color: "#DC2626" },
    { label: "Controles", list: controls, color: "#059669" },
  ];

  const activeList = tabItems[activeTab].list;

  if (loading) {
    return (
      <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F0F4F8", pb: 10 }}>
        <Container maxWidth="lg" sx={{ pt: 6 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 6, gap: 3 }}>
            <Box>
              <Skeleton width={200} height={36} sx={{ borderRadius: 1 }} />
              <Skeleton width={280} height={20} sx={{ borderRadius: 1, mt: 0.5 }} />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton width={160} height={42} sx={{ borderRadius: 1.5 }} />
              <Skeleton width={140} height={42} sx={{ borderRadius: 1.5 }} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 3, mb: 5 }}>
            {[1, 2, 3].map((i) => <Skeleton key={i} width={100} height={48} sx={{ borderRadius: 2 }} />)}
          </Box>
          <Grid container spacing={2.5}>
            {[1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <EvaluatedCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F0F4F8", pb: 10 }}>
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        {/* Page header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 5,
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 28, fontWeight: 600, color: "#111827", mb: 0.5 }}>
              Evaluados
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: "#4B5563", fontWeight: 300 }}>
              Administra pacientes y controles del sistema
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              startIcon={<AssessmentIcon sx={{ fontSize: 15 }} />}
              onClick={() => navigate("/tests")}
              disabled={evaluatedList.length === 0}
              sx={secondaryBtnStyle}
            >
              Administrar tests
            </Button>
            <Button
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={() => setOpenForm(true)}
              sx={primaryBtnStyle}
            >
              Nuevo evaluado
            </Button>
          </Box>
        </Box>

        {/* Stats row */}
        <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
          <StatPill label="Total" value={evaluatedList.length} />
          <StatPill label="Pacientes" value={patients.length} accent="#DC2626" />
          <StatPill label="Controles" value={controls.length} accent="#059669" />
        </Box>

        {/* Empty state */}
        {evaluatedList.length === 0 ? (
          <EmptyState onAdd={() => setOpenForm(true)} />
        ) : (
          <>
            {/* Tabs */}
            <Box sx={{ mb: 4, borderBottom: "1px solid #E2E8F0" }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                TabIndicatorProps={{ style: { backgroundColor: tabItems[activeTab].color, height: 2 } }}
                sx={{
                  minHeight: 42,
                  "& .MuiTab-root": {
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 13,
                    fontWeight: 400,
                    color: "#6B7280",
                    textTransform: "none",
                    minHeight: 42,
                    px: 2,
                    "&.Mui-selected": { color: "#111827", fontWeight: 600 },
                  },
                }}
              >
                {tabItems.map((tab, i) => (
                  <Tab
                    key={tab.label}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {tab.label}
                        <Box
                          sx={{
                            px: 1,
                            py: 0.1,
                            bgcolor: activeTab === i ? `${tab.color}18` : "#F3F4F6",
                            borderRadius: 0.75,
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: '"DM Sans", sans-serif',
                              fontSize: 11,
                              fontWeight: 600,
                              color: activeTab === i ? tab.color : "#9CA3AF",
                              lineHeight: 1.6,
                              transition: "color 0.2s ease",
                            }}
                          >
                            {tab.list.length}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            </Box>

            {/* Cards grid */}
            {activeList.length === 0 ? (
              <Box
                sx={{
                  bgcolor: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 2,
                  py: 6,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#9CA3AF" }}>
                  No hay {tabItems[activeTab].label.toLowerCase()} registrados
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2.5}>
                {activeList.map((evaluated, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={evaluated.id}>
                    <Fade in timeout={400} style={{ transitionDelay: `${index * 70}ms` }}>
                      <Box>
                        <EvaluatedCard
                          evaluated={evaluated}
                          onDelete={handleDeleteEvaluated}
                          onEdit={(ev) => setEditingEvaluated(ev)}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>

      <EvaluatedForm open={openForm} onClose={() => setOpenForm(false)} onSuccess={handleAddEvaluated} />
      <EvaluatedEditForm
        open={!!editingEvaluated}
        evaluated={editingEvaluated}
        onClose={() => setEditingEvaluated(null)}
        onSuccess={handleUpdateEvaluated}
      />
    </Box>
  );
};

/* ── Sub-components ── */

const EvaluatedCardSkeleton = () => (
  <Box
    sx={{
      bgcolor: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: 2.5,
      overflow: "hidden",
    }}
  >
    <Skeleton variant="rectangular" height={3} sx={{ bgcolor: "#E2E8F0" }} />
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2.5 }}>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Skeleton variant="circular" width={38} height={38} />
          <Box>
            <Skeleton width={120} height={20} sx={{ mb: 0.5 }} />
            <Skeleton width={80} height={16} />
          </Box>
        </Box>
        <Skeleton width={64} height={24} sx={{ borderRadius: 1 }} />
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2.5, pb: 2.5, borderBottom: "1px solid #F3F4F6" }}>
        <Skeleton flex={1} height={40} sx={{ flex: 1 }} />
        <Skeleton flex={1} height={40} sx={{ flex: 1 }} />
      </Box>
      <Skeleton width={80} height={16} />
    </Box>
    <Skeleton variant="rectangular" height={50} />
  </Box>
);

const StatPill = ({ label, value, accent = "#1B4F8A" }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      px: 2.5,
      py: 1.5,
      bgcolor: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: 2,
    }}
  >
    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: accent }} />
    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#4B5563" }}>
      {label}
    </Typography>
    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 16, fontWeight: 700, color: "#111827" }}>
      {value}
    </Typography>
  </Box>
);

const EmptyState = ({ onAdd }) => (
  <Box>
    <Box
      sx={{
        mb: 4,
        p: 2.5,
        bgcolor: "#EBF2FB",
        border: "1px solid #BFDBFE",
        borderRadius: 2,
      }}
    >
      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#1B4F8A" }}>
        No hay evaluados registrados. Agrega al menos uno para poder crear tests.
      </Typography>
    </Box>
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 2.5,
        py: 10,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          bgcolor: "#F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2.5,
        }}
      >
        <AddIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />
      </Box>
      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, fontWeight: 500, color: "#374151", mb: 1 }}>
        Sin evaluados registrados
      </Typography>
      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#9CA3AF", fontWeight: 300, mb: 4 }}>
        Agrega el primer paciente o control
      </Typography>
      <Button onClick={onAdd} sx={primaryBtnStyle}>
        Agregar evaluado
      </Button>
    </Box>
  </Box>
);

const primaryBtnStyle = {
  height: 42,
  px: 3,
  bgcolor: "#1B4F8A",
  color: "#fff",
  borderRadius: 1.5,
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 500,
  fontSize: 13,
  textTransform: "none",
  "&:hover": { bgcolor: "#153D6B" },
};

const secondaryBtnStyle = {
  height: 42,
  px: 3,
  border: "1px solid #E2E8F0",
  color: "#374151",
  borderRadius: 1.5,
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 400,
  fontSize: 13,
  textTransform: "none",
  "&:hover": { bgcolor: "#F0F4F8" },
  "&:disabled": { opacity: 0.4 },
};

export default EvaluatedScreen;
