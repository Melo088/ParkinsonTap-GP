import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { evaluatedService } from "../services/evaluatedService";
import EvaluatedCard from "../components/EvaluatedCard";
import EvaluatedForm from "../components/EvaluatedForm";
import Grid from "@mui/material/Grid";

console.log("EvaluatedScreen loaded");

const EvaluatedScreen = () => {
  const [evaluatedList, setEvaluatedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadEvaluated();
  }, []);

  const loadEvaluated = async () => {
    try {
      setLoading(true);
      const data = await evaluatedService.getAllEvaluated();
      setEvaluatedList(data);
      setError("");
    } catch (error) {
      setError("Error al cargar los evaluados: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvaluated = async (evaluatedData) => {
    try {
      await evaluatedService.registerEvaluated(evaluatedData);
      await loadEvaluated();
      setError("");
      setSuccess("Evaluado agregado correctamente.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error al agregar evaluado: " + error.message);
      setSuccess("");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteEvaluated = async (evaluatedId) => {
    try {
      await evaluatedService.deleteEvaluated(evaluatedId);
      await loadEvaluated();
      setSuccess("Evaluado eliminado correctamente.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error al eliminar evaluado: " + error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const patients = evaluatedList.filter(
    (e) => e.evaluatedTypeName?.toLowerCase() === "pacientes",
  );
  const controls = evaluatedList.filter(
    (e) => e.evaluatedTypeName?.toLowerCase() === "controles",
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F7F6F3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={32} sx={{ color: "#0D1117", mb: 2 }} />
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              color: "#9CA3AF",
            }}
          >
            Cargando evaluados…
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F6F3", pb: 10 }}>
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
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 28,
                fontWeight: 600,
                color: "#0D1117",
                mb: 0.5,
              }}
            >
              Evaluados
            </Typography>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 14,
                color: "#6B7280",
                fontWeight: 300,
              }}
            >
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

        {/* Toast */}
        {(success || error) && (
          <Box
            sx={{
              mb: 4,
              p: 2,
              bgcolor: success ? "#ECFDF5" : "#FEF2F2",
              border: `1px solid ${success ? "#A7F3D0" : "#FECACA"}`,
              borderRadius: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                color: success ? "#065F46" : "#B91C1C",
              }}
            >
              {success || error}
            </Typography>
          </Box>
        )}

        {/* Empty state info */}
        {evaluatedList.length === 0 && (
          <Box
            sx={{
              mb: 4,
              p: 2.5,
              bgcolor: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                color: "#1D4ED8",
              }}
            >
              No hay evaluados registrados. Agrega al menos uno para poder crear
              tests.
            </Typography>
          </Box>
        )}

        {/* Stats row */}
        <Box sx={{ display: "flex", gap: 3, mb: 5, flexWrap: "wrap" }}>
          <StatPill label="Total" value={evaluatedList.length} />
          <StatPill
            label="Pacientes"
            value={patients.length}
            accent="#EF4444"
          />
          <StatPill
            label="Controles"
            value={controls.length}
            accent="#10B981"
          />
        </Box>

        {/* Pacientes section */}
        <Section
          title="Pacientes"
          count={patients.length}
          accentColor="#EF4444"
          emptyMessage="No hay pacientes registrados"
        >
          {patients.map((evaluated) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={evaluated.id}>
              <EvaluatedCard
                evaluated={evaluated}
                onDelete={handleDeleteEvaluated}
              />
            </Grid>
          ))}
        </Section>

        {/* Controles section */}
        <Section
          title="Controles"
          count={controls.length}
          accentColor="#10B981"
          emptyMessage="No hay controles registrados"
        >
          {controls.map((evaluated) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={evaluated.id}>
              <EvaluatedCard
                evaluated={evaluated}
                onDelete={handleDeleteEvaluated}
              />
            </Grid>
          ))}
        </Section>
      </Container>

      {/* FAB */}
      <Box sx={{ position: "fixed", bottom: 28, right: 28 }}>
        <Button
          onClick={() => setOpenForm(true)}
          sx={{
            height: 48,
            px: 3,
            bgcolor: "#0D1117",
            color: "#fff",
            borderRadius: 2,
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 500,
            fontSize: 13,
            textTransform: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            "&:hover": { bgcolor: "#1a2332" },
            gap: 1,
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} /> Nuevo evaluado
        </Button>
      </Box>

      <EvaluatedForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={handleAddEvaluated}
      />
    </Box>
  );
};

/* ── Sub-components ── */

const StatPill = ({ label, value, accent = "#0D1117" }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      px: 2.5,
      py: 1.5,
      bgcolor: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: 2,
    }}
  >
    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: accent }} />
    <Typography
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 13,
        color: "#6B7280",
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 16,
        fontWeight: 700,
        color: "#0D1117",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const Section = ({ title, count, accentColor, emptyMessage, children }) => (
  <Box sx={{ mb: 6 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
      <Box
        sx={{ width: 3, height: 18, bgcolor: accentColor, borderRadius: 1 }}
      />
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 15,
          fontWeight: 600,
          color: "#0D1117",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          px: 1.25,
          py: 0.25,
          bgcolor: "#F3F4F6",
          borderRadius: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
            color: "#6B7280",
            fontWeight: 500,
          }}
        >
          {count}
        </Typography>
      </Box>
    </Box>

    {count === 0 ? (
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 2,
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            color: "#9CA3AF",
          }}
        >
          {emptyMessage}
        </Typography>
      </Box>
    ) : (
      <Grid container spacing={2.5}>
        {children}
      </Grid>
    )}
  </Box>
);

const primaryBtnStyle = {
  height: 42,
  px: 3,
  bgcolor: "#0D1117",
  color: "#fff",
  borderRadius: 1.5,
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 500,
  fontSize: 13,
  textTransform: "none",
  "&:hover": { bgcolor: "#1a2332" },
};

const secondaryBtnStyle = {
  height: 42,
  px: 3,
  border: "1px solid #E5E7EB",
  color: "#374151",
  borderRadius: 1.5,
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 400,
  fontSize: 13,
  textTransform: "none",
  "&:hover": { bgcolor: "#F9FAFB" },
  "&:disabled": { opacity: 0.4 },
};

export default EvaluatedScreen;
