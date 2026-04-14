import React from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { AssignmentAdd } from "@mui/icons-material";

const FormTest = ({
  testName,
  setTestName,
  side,
  setSide,
  message,
  setMessage,
  selectedEvaluado,
  setSelectedEvaluado,
  evaluados,
  formTouched,
  handleSubmit,
  loading,
  responseMessage,
}) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F6F3", py: 6, px: 3 }}>
      <Box sx={{ maxWidth: 560, mx: "auto" }}>
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 600,
            color: "#0D1117",
            mb: 0.5,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          Nuevo test
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            color: "#6B7280",
            mb: 6,
            fontWeight: 300,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          Completa la información para registrar la evaluación
        </Typography>

        {responseMessage && (
          <Box
            sx={{
              mb: 4,
              p: 2,
              bgcolor: responseMessage.includes("Error")
                ? "#FEF2F2"
                : "#ECFDF5",
              borderRadius: 2,
              border: "1px solid",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: responseMessage.includes("Error")
                  ? "#B91C1C"
                  : "#065F46",
              }}
            >
              {responseMessage}
            </Typography>
          </Box>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 2.5,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box>
            <Typography sx={labelStyle}>Nombre del test</Typography>
            <TextField
              fullWidth
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              error={formTouched && !testName}
              sx={inputStyle}
            />
          </Box>

          <Box>
            <Typography sx={labelStyle}>Lado del cuerpo</Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {["izquierdo", "derecho"].map((opt) => (
                <Box
                  key={opt}
                  onClick={() => setSide(opt)}
                  sx={{
                    flex: 1,
                    py: 1.25,
                    borderRadius: 1.5,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: side === opt ? "#0D1117" : "#fff",
                    color: side === opt ? "#fff" : "#374151",
                    border: "1px solid",
                    borderColor: side === opt ? "#0D1117" : "#E5E7EB",
                    fontWeight: 500,
                    fontSize: 13,
                    transition: "0.2s",
                  }}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography sx={labelStyle}>Descripción</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={inputStyle}
            />
          </Box>

          <Box>
            <Typography sx={labelStyle}>Evaluado</Typography>
            <Select
              value={evaluados.length > 0 ? selectedEvaluado : ""}
              onChange={(e) => setSelectedEvaluado(e.target.value)}
              displayEmpty
              fullWidth
              sx={selectStyle}
            >
              <MenuItem value="" disabled>
                Selecciona un evaluado
              </MenuItem>
              {evaluados.map((ev) => (
                <MenuItem
                  key={ev.id || ev.idEvaluado}
                  value={ev.id || ev.idEvaluado}
                >
                  {ev.nombre || ev.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={submitBtnStyle}
          >
            {loading ? <CircularProgress size={20} /> : "Crear test"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Estilos rápidos para limpiar el código
const labelStyle = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: 12,
  fontWeight: 500,
  color: "#374151",
  mb: 1,
};
const inputStyle = {
  "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontSize: 13 },
};
const selectStyle = { borderRadius: 1.5, fontSize: 13 };
const submitBtnStyle = {
  height: 48,
  bgcolor: "#0D1117",
  color: "#fff",
  borderRadius: 1.5,
  textTransform: "none",
  "&:hover": { bgcolor: "#1a2332" },
};

export default FormTest;
