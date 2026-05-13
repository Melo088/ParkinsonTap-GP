import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { evaluatedService } from "../services/testService";
import TestCard from "../components/TestCard";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "../context/SnackbarContext";

const TestScreen = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const testsData = await evaluatedService.getAllTests();

      const testsWithDataInfo = await Promise.all(
        testsData.map(async (test) => {
          try {
            const hasData = await evaluatedService.hasData(test.testId);
            return { ...test, hasData };
          } catch {
            return { ...test, hasData: false };
          }
        }),
      );

      setTests(testsWithDataInfo);
    } catch (error) {
      showError("Error al cargar los tests: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId) => {
    try {
      await evaluatedService.deleteTest(testId);
      await loadTests();
      showSuccess("Test eliminado correctamente.");
    } catch (error) {
      showError("Error al eliminar test: " + error.message);
    }
  };

  const handleDataDelete = async (testId) => {
    try {
      await evaluatedService.deleteTestData(testId);
      await loadTests();
      showSuccess("Datos del test eliminados correctamente.");
    } catch (error) {
      showError("Error al eliminar los datos del test: " + error.message);
    }
    setTests((prev) =>
      prev.map((t) => (t.testId === testId ? { ...t, hasData: false } : t)),
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          bgcolor: "#F0F4F8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={32} sx={{ color: "#1B4F8A", mb: 2 }} />
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#9CA3AF" }}>
            Cargando tests…
          </Typography>
        </Box>
      </Box>
    );
  }

  const withData = tests.filter((t) => t.hasData);
  const withoutData = tests.filter((t) => !t.hasData);

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F0F4F8", pb: 10 }}>
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        {/* Page header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 6,
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 28, fontWeight: 600, color: "#111827", mb: 0.5 }}>
              Tests
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: "#4B5563", fontWeight: 300 }}>
              Administra y supervisa todas las evaluaciones
            </Typography>
          </Box>

          <Button
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => navigate("/form")}
            sx={primaryBtnStyle}
          >
            Nuevo test
          </Button>
        </Box>

        {/* Stats row */}
        <Box sx={{ display: "flex", gap: 3, mb: 5, flexWrap: "wrap" }}>
          <StatPill label="Total" value={tests.length} />
          <StatPill label="Con datos" value={withData.length} accent="#059669" />
          <StatPill label="Sin datos" value={withoutData.length} accent="#9CA3AF" />
        </Box>

        {/* Empty state */}
        {tests.length === 0 ? (
          <EmptyState onAdd={() => navigate("/form")} />
        ) : (
          <Grid container spacing={2.5}>
            {tests.map((test) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={test.testId}>
                <TestCard
                  test={test}
                  onDelete={handleDeleteTest}
                  onDataDelete={handleDataDelete}
                  currentDoctorEmail={authService.getCurrentUserEmail()}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* FAB */}
      {tests.length > 0 && (
        <Box sx={{ position: "fixed", bottom: 28, right: 28 }}>
          <Button
            onClick={() => navigate("/form")}
            sx={{
              height: 48,
              px: 3,
              bgcolor: "#1B4F8A",
              color: "#fff",
              borderRadius: 2,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 500,
              fontSize: 13,
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(27,79,138,0.3)",
              "&:hover": { bgcolor: "#153D6B" },
              gap: 1,
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} /> Nuevo test
          </Button>
        </Box>
      )}
    </Box>
  );
};

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
      Sin tests registrados
    </Typography>
    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#9CA3AF", fontWeight: 300, mb: 4 }}>
      Crea el primer test para comenzar
    </Typography>
    <Button onClick={onAdd} sx={primaryBtnStyle}>
      Crear test
    </Button>
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

export default TestScreen;
