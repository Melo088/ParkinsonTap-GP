import React, { useState } from "react";
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  CheckCircleOutline,
  ErrorOutline,
} from "@mui/icons-material";

function DataAcquisitionButton({ testId, onStartTest, isLoading, status, error }) {
  const [duration, setDuration] = useState(10);

  const durationOptions = [
    { value: 5, label: "5 s" },
    { value: 10, label: "10 s" },
    { value: 15, label: "15 s" },
    { value: 20, label: "20 s" },
    { value: 30, label: "30 s" },
    { value: 45, label: "45 s" },
    { value: 60, label: "1 min" },
  ];

  const handleStartTest = () => onStartTest(duration);

  const statusConfig = {
    collecting: {
      label: "Recolectando datos del sensor…",
      color: "#D97706",
      bg: "#FFFBEB",
      border: "#FDE68A",
    },
    uploading: {
      label: "Enviando datos al servidor…",
      color: "#1B4F8A",
      bg: "#EBF2FB",
      border: "#BFDBFE",
    },
    success: {
      label: "Datos enviados correctamente",
      color: "#059669",
      bg: "#ECFDF5",
      border: "#A7F3D0",
    },
    error: {
      label: error || "Error en la transmisión de datos",
      color: "#DC2626",
      bg: "#FEF2F2",
      border: "#FECACA",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 2.5,
        p: { xs: 3, sm: 4 },
        maxWidth: 520,
        mx: "auto",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 18, fontWeight: 600, color: "#111827", mb: 0.5 }}>
          Toma de datos
        </Typography>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#4B5563", fontWeight: 300 }}>
          Selecciona la duración e inicia la prueba
        </Typography>
      </Box>

      {/* Test ID badge */}
      {testId && (
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.75,
              bgcolor: "#EBF2FB",
              borderRadius: 1.5,
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#1B4F8A" }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "#1B4F8A", fontWeight: 500 }}>
              Test #{testId}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Duration selector */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 500, color: "#374151", mb: 1 }}>
          Duración
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {durationOptions.map((opt) => (
            <Box
              key={opt.value}
              onClick={() => !isLoading && setDuration(opt.value)}
              sx={{
                px: 2,
                py: 0.875,
                border: "1px solid",
                borderColor: duration === opt.value ? "#1B4F8A" : "#E2E8F0",
                bgcolor: duration === opt.value ? "#1B4F8A" : "#fff",
                color: duration === opt.value ? "#fff" : "#374151",
                borderRadius: 1.5,
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                fontWeight: 500,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
                transition: "all 0.15s ease",
                userSelect: "none",
              }}
            >
              {opt.label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Info row (when idle) */}
      {!isLoading && !status && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "#F9FAFB",
            border: "1px solid #F3F4F6",
            borderRadius: 1.5,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#9CA3AF", mb: 0.25 }}>
              DURACIÓN
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: "#111827", fontWeight: 500 }}>
              {duration} segundos
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#9CA3AF", mb: 0.25 }}>
              MUESTRAS APROX.
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: "#111827", fontWeight: 500 }}>
              ~{Math.round(duration * 25)} @ 25 Hz
            </Typography>
          </Box>
        </Box>
      )}

      {/* Status */}
      {status && currentStatus && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: currentStatus.bg,
            border: `1px solid ${currentStatus.border}`,
            borderRadius: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: status === "collecting" || status === "uploading" ? 1.5 : 0,
            }}
          >
            {(status === "collecting" || status === "uploading") && (
              <CircularProgress size={14} sx={{ color: currentStatus.color }} />
            )}
            {status === "success" && (
              <CheckCircleOutline sx={{ fontSize: 16, color: currentStatus.color }} />
            )}
            {status === "error" && (
              <ErrorOutline sx={{ fontSize: 16, color: currentStatus.color }} />
            )}
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 500, color: currentStatus.color }}>
              {currentStatus.label}
            </Typography>
          </Box>

          {(status === "collecting" || status === "uploading") && (
            <LinearProgress
              sx={{
                borderRadius: 1,
                height: 3,
                bgcolor: "rgba(0,0,0,0.06)",
                "& .MuiLinearProgress-bar": { bgcolor: currentStatus.color },
              }}
            />
          )}
        </Box>
      )}

      {/* Action buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          fullWidth
          onClick={handleStartTest}
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={16} sx={{ color: "#9CA3AF" }} />
            ) : (
              <PlayArrowIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{
            height: 46,
            bgcolor: "#1B4F8A",
            color: "#fff",
            borderRadius: 1.5,
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 500,
            fontSize: 13,
            textTransform: "none",
            "&:hover": { bgcolor: "#153D6B" },
            "&:disabled": { bgcolor: "#F3F4F6", color: "#9CA3AF" },
          }}
        >
          {isLoading ? "Procesando…" : `Iniciar prueba · ${duration}s`}
        </Button>

        {status === "error" && (
          <Button
            onClick={() => window.location.reload()}
            sx={{
              height: 46,
              px: 2.5,
              border: "1px solid #E2E8F0",
              color: "#374151",
              borderRadius: 1.5,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 400,
              fontSize: 13,
              textTransform: "none",
              "&:hover": { bgcolor: "#F0F4F8" },
              whiteSpace: "nowrap",
            }}
          >
            Reintentar
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default DataAcquisitionButton;
