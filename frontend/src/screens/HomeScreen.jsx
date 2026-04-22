import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F6F3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: 520, width: "100%" }}>
        {/* Eyebrow */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
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
              fontSize: 12,
              fontWeight: 500,
              color: "#6B7280",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Sistema activo
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: { xs: 34, sm: 44 },
            fontWeight: 600,
            color: "#0D1117",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            mb: 3,
          }}
        >
          Evaluación de
          <br />
          <Box component="span" sx={{ color: "#9CA3AF", fontWeight: 300 }}>
            Parkinson Tap
          </Box>
        </Typography>

        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 15,
            color: "#6B7280",
            fontWeight: 300,
            lineHeight: 1.75,
            mb: 6,
            maxWidth: 420,
          }}
        >
          Crea tests, administra pacientes y captura datos de sensores en tiempo
          real mediante conexión MQTT.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
            onClick={() => navigate("/form")}
            sx={{
              height: 46,
              px: 3.5,
              bgcolor: "#0D1117",
              color: "#fff",
              borderRadius: 1.5,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 500,
              fontSize: 13,
              textTransform: "none",
              "&:hover": { bgcolor: "#1a2332" },
            }}
          >
            Crear nuevo test
          </Button>
          <Button
            onClick={() => navigate("/doctor")}
            sx={{
              height: 46,
              px: 3.5,
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
            Ver evaluados
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default HomeScreen;
