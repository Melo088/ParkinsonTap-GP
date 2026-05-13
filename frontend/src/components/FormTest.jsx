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
}) => {
  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F0F4F8", py: 6, px: 3 }}>
      <Box sx={{ maxWidth: 560, mx: "auto" }}>
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 600,
            color: "#111827",
            mb: 0.5,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          Nuevo test
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            color: "#4B5563",
            mb: 6,
            fontWeight: 300,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          Completa la información para registrar la evaluación
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: "#fff",
            border: "1px solid #E2E8F0",
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
                    bgcolor: side === opt ? "#1B4F8A" : "#fff",
                    color: side === opt ? "#fff" : "#374151",
                    border: "1px solid",
                    borderColor: side === opt ? "#1B4F8A" : "#E2E8F0",
                    fontWeight: 500,
                    fontSize: 13,
                    fontFamily: '"DM Sans", sans-serif',
                    transition: "0.15s",
                    userSelect: "none",
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
                <MenuItem key={ev.id || ev.idEvaluado} value={ev.id || ev.idEvaluado}>
                  {ev.nombre || ev.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Button type="submit" fullWidth disabled={loading} sx={submitBtnStyle}>
            {loading ? <CircularProgress size={20} sx={{ color: "#9CA3AF" }} /> : "Crear test"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const labelStyle = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: 12,
  fontWeight: 500,
  color: "#374151",
  mb: 1,
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: 13,
    fontFamily: '"DM Sans", sans-serif',
    "& fieldset": { borderColor: "#E2E8F0" },
    "&:hover fieldset": { borderColor: "#9CA3AF" },
    "&.Mui-focused fieldset": { borderColor: "#1B4F8A", borderWidth: 1.5 },
  },
};

const selectStyle = {
  borderRadius: 1.5,
  fontSize: 13,
  fontFamily: '"DM Sans", sans-serif',
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9CA3AF" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1B4F8A", borderWidth: 1.5 },
};

const submitBtnStyle = {
  height: 48,
  bgcolor: "#1B4F8A",
  color: "#fff",
  borderRadius: 1.5,
  textTransform: "none",
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 500,
  "&:hover": { bgcolor: "#153D6B" },
  "&:disabled": { bgcolor: "#F3F4F6", color: "#9CA3AF" },
};

export default FormTest;
