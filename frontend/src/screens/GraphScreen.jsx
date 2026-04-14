import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, RotateRight } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import { readingService } from "../services/readingService";
import GraphChart from "../components/GraphChart";

const GraphScreen = () => {
  const navigate = useNavigate();
  const { testId } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!testId) {
      setError("ID de test no proporcionado en la URL");
      setLoading(false);
      return;
    }
    loadGraphData();
  }, [testId]);

  const loadGraphData = async () => {
    try {
      setLoading(true);
      setError("");
      const graphData = await readingService.fetchGraphData(testId);
      if (graphData.length === 0) {
        setError("No se encontraron datos para este test");
      } else {
        setData(graphData);
      }
    } catch (error) {
      setError(error.message || "Error al cargar los datos del gráfico");
    } finally {
      setLoading(false);
    }
  };

  /* ── No testId ── */
  if (!testId) {
    return (
      <CenteredMessage>
        <Typography sx={headingStyle}>ID no encontrado</Typography>
        <Typography sx={subStyle}>
          No se proporcionó un ID de test válido en la URL.
        </Typography>
        <Button
          onClick={() => navigate("/tests")}
          sx={backBtnStyle}
          startIcon={<ArrowBack sx={{ fontSize: 15 }} />}
        >
          Volver a tests
        </Button>
      </CenteredMessage>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <CenteredMessage>
        <CircularProgress size={32} sx={{ color: "#0D1117", mb: 2 }} />
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            color: "#9CA3AF",
          }}
        >
          Cargando datos del test…
        </Typography>
      </CenteredMessage>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F6F3", pb: 8 }}>
      <Container maxWidth="xl" sx={{ pt: 6 }}>
        {/* Page header */}
        <Box sx={{ mb: 6 }}>
          <Button
            startIcon={<ArrowBack sx={{ fontSize: 15 }} />}
            onClick={() => navigate("/tests")}
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              color: "#6B7280",
              textTransform: "none",
              fontWeight: 400,
              p: 0,
              mb: 3,
              "&:hover": { bgcolor: "transparent", color: "#374151" },
            }}
          >
            Volver a tests
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
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
                Análisis de datos
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 14,
                  color: "#6B7280",
                  fontWeight: 300,
                }}
              >
                Test #{testId}
              </Typography>
            </Box>

            <Button
              startIcon={<RotateRight sx={{ fontSize: 15 }} />}
              onClick={loadGraphData}
              disabled={loading}
              sx={{
                height: 40,
                px: 2.5,
                border: "1px solid #E5E7EB",
                color: "#374151",
                borderRadius: 1.5,
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 400,
                fontSize: 13,
                textTransform: "none",
                "&:hover": { bgcolor: "#F9FAFB" },
              }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        {/* Error */}
        {error && (
          <Box
            sx={{
              mb: 4,
              p: 2.5,
              bgcolor: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                color: "#B91C1C",
              }}
            >
              {error}
            </Typography>
            <Button
              onClick={loadGraphData}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 12,
                color: "#B91C1C",
                textTransform: "none",
                fontWeight: 500,
                p: 0,
                flexShrink: 0,
                "&:hover": { bgcolor: "transparent", color: "#991B1B" },
              }}
            >
              Reintentar
            </Button>
          </Box>
        )}

        {/* Stats pill */}
        {data.length > 0 && (
          <Box sx={{ display: "flex", gap: 3, mb: 5, flexWrap: "wrap" }}>
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
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#4ECBA0",
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Lecturas
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0D1117",
                }}
              >
                {data.length.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Charts */}
        {data.length > 0 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <GraphChart
                data={data}
                title="Acelerómetro"
                dataKeys={[
                  { key: "ax", axis: "left", color: "#1976d2" },
                  { key: "ay", axis: "left", color: "#dc004e" },
                  { key: "az", axis: "left", color: "#2e7d32" },
                ]}
                yAxisLabelLeft="Aceleración (m/s²)"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <GraphChart
                data={data}
                title="Giroscopio — Roll, Pitch y Yaw"
                dataKeys={[
                  { key: "p", axis: "left", color: "#ff9800" },
                  { key: "r", axis: "left", color: "#9c27b0" },
                  { key: "y", axis: "left", color: "#f44336" },
                ]}
                yAxisLabelLeft="Ángulo (°)"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <GraphChart
                data={data}
                title="Aceleración X y Roll"
                dataKeys={[
                  { key: "ax", axis: "left", color: "#1976d2" },
                  { key: "r", axis: "right", color: "#9c27b0" },
                ]}
                yAxisLabelLeft="Aceleración (m/s²)"
                yAxisLabelRight="Ángulo (°)"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <GraphChart
                data={data}
                title="Aceleración Y y Pitch"
                dataKeys={[
                  { key: "ay", axis: "left", color: "#dc004e" },
                  { key: "p", axis: "right", color: "#ff9800" },
                ]}
                yAxisLabelLeft="Aceleración (m/s²)"
                yAxisLabelRight="Ángulo (°)"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <GraphChart
                data={data}
                title="Aceleración Z y Yaw"
                dataKeys={[
                  { key: "az", axis: "left", color: "#2e7d32" },
                  { key: "y", axis: "right", color: "#f44336" },
                ]}
                yAxisLabelLeft="Aceleración (m/s²)"
                yAxisLabelRight="Ángulo (°)"
              />
            </Grid>
          </Grid>
        )}

        {/* Empty state */}
        {!loading && !error && data.length === 0 && (
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 2.5,
              py: 10,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 15,
                fontWeight: 500,
                color: "#374151",
                mb: 1,
              }}
            >
              Sin datos disponibles
            </Typography>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                color: "#9CA3AF",
                fontWeight: 300,
                mb: 4,
              }}
            >
              Este test aún no tiene lecturas de sensores registradas
            </Typography>
            <Button
              onClick={loadGraphData}
              sx={{
                ...backBtnStyle,
                border: "1px solid #E5E7EB",
                color: "#374151",
                bgcolor: "transparent",
                "&:hover": { bgcolor: "#F9FAFB" },
              }}
            >
              Verificar nuevamente
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

/* ── helpers ── */

const CenteredMessage = ({ children }) => (
  <Box
    sx={{
      minHeight: "100vh",
      bgcolor: "#F7F6F3",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      px: 3,
      gap: 2,
    }}
  >
    {children}
  </Box>
);

const headingStyle = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: 22,
  fontWeight: 600,
  color: "#0D1117",
};
const subStyle = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: 14,
  color: "#6B7280",
  fontWeight: 300,
};
const backBtnStyle = {
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

export default GraphScreen;
