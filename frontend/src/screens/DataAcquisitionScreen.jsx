import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import DataAcquisitionButton from "../components/DataAcquisitionButton";
import {
  connectMQTT,
  sendStartMessage,
} from "../services/dataAcquisitionService";

function DataAcquisitionScreen() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    connectMQTT();
  }, []);

  const handleStartTest = async (duration) => {
    if (!testId) return;
    setIsLoading(true);
    setStatus("collecting");
    setError(null);

    try {
      setTimeout(() => {
        if (status === "collecting") setStatus("uploading");
      }, duration * 1000);

      const result = await sendStartMessage(testId, duration);
      setStatus("success");
      setIsLoading(false);

      setTimeout(() => {
        navigate(`/grafica/${testId}`);
      }, 2000);
    } catch (error) {
      setStatus("error");
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F6F3", py: 6, px: 3 }}>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {/* Page header */}
        <Box sx={{ mb: 6 }}>
          <Button
            startIcon={<ArrowBack sx={{ fontSize: 16 }} />}
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

          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 28,
              fontWeight: 600,
              color: "#0D1117",
              mb: 1,
            }}
          >
            Adquisición de datos
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14,
              color: "#6B7280",
              fontWeight: 300,
            }}
          >
            Conecta el sensor y configura la duración de la sesión de captura
          </Typography>
        </Box>

        {/* Warning when no testId */}
        {!testId && (
          <Box
            sx={{
              p: 2.5,
              bgcolor: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: 2,
              mb: 4,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                color: "#92400E",
              }}
            >
              No se ha proporcionado un ID de test válido en la URL.
            </Typography>
          </Box>
        )}

        <DataAcquisitionButton
          testId={testId}
          onStartTest={handleStartTest}
          isLoading={isLoading}
          status={status}
          error={error}
        />
      </Box>
    </Box>
  );
}

export default DataAcquisitionScreen;
