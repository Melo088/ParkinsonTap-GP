import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  Switch,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const EvaluatedForm = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    height: "",
    weight: "",
    notes: "",
    evaluatedType: "",
    gender: "",
    status: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const evaluatedTypes = [
    { id: 1, name: "PACIENTES" },
    { id: 2, name: "CONTROLES" },
  ];

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const transformedData = {
        name: formData.name,
        birthDate: formData.birth_date,
        genreName: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        notes: formData.notes,
        evaluatedTypeName: evaluatedTypes.find(
          (t) => t.id === formData.evaluatedType,
        )?.name,
        status: formData.status,
      };
      await onSuccess(transformedData);
      setFormData({
        name: "",
        birth_date: "",
        height: "",
        weight: "",
        notes: "",
        evaluatedType: "",
        gender: "",
        status: false,
      });
      onClose();
    } catch (error) {
      setError(error.message || "Error al enviar el formulario");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        birth_date: "",
        height: "",
        weight: "",
        notes: "",
        evaluatedType: "",
        gender: "",
        status: false,
      });
      setError("");
      onClose();
    }
  };

  const selectedType = evaluatedTypes.find(
    (t) => t.id === formData.evaluatedType,
  );
  const isPatient = selectedType?.name?.toLowerCase() === "pacientes";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          border: "1px solid #E5E7EB",
          boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
          m: { xs: 2, sm: 3 },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 17,
              fontWeight: 600,
              color: "#0D1117",
            }}
          >
            Nuevo evaluado
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              color: "#6B7280",
              fontWeight: 300,
              mt: 0.25,
            }}
          >
            Completa los datos del paciente o control
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          size="small"
          sx={{ color: "#9CA3AF" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
        {error && (
          <Box
            sx={{
              mb: 2.5,
              p: 2,
              bgcolor: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 1.5,
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
          </Box>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          {/* Nombre */}
          <Box>
            <Typography sx={labelStyle}>Nombre completo</Typography>
            <TextField
              required
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="Juan García"
              sx={inputStyle}
            />
          </Box>

          {/* Grid: fecha + género */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography sx={labelStyle}>Fecha de nacimiento</Typography>
              <TextField
                required
                fullWidth
                name="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={handleChange}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                sx={inputStyle}
              />
            </Box>
            <Box>
              <Typography sx={labelStyle}>Género</Typography>
              <Select
                required
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
                fullWidth
                displayEmpty
                sx={selectStyle}
              >
                <MenuItem value="" disabled>
                  <span style={{ color: "#9CA3AF" }}>Seleccionar</span>
                </MenuItem>
                <MenuItem value="MASCULINO">Masculino</MenuItem>
                <MenuItem value="FEMENINO">Femenino</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Tipo */}
          <Box>
            <Typography sx={labelStyle}>Tipo de evaluado</Typography>
            <Select
              required
              name="evaluatedType"
              value={formData.evaluatedType}
              onChange={handleChange}
              disabled={loading}
              fullWidth
              displayEmpty
              sx={selectStyle}
            >
              <MenuItem value="" disabled>
                <span style={{ color: "#9CA3AF" }}>Seleccionar tipo</span>
              </MenuItem>
              {evaluatedTypes.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Grid: altura + peso */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography sx={labelStyle}>Altura (cm)</Typography>
              <TextField
                required
                fullWidth
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                disabled={loading}
                placeholder="170"
                inputProps={{ min: 0, step: 0.1 }}
                sx={inputStyle}
              />
            </Box>
            <Box>
              <Typography sx={labelStyle}>Peso (kg)</Typography>
              <TextField
                required
                fullWidth
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                disabled={loading}
                placeholder="70"
                inputProps={{ min: 0, step: 0.1 }}
                sx={inputStyle}
              />
            </Box>
          </Box>

          {/* Medicamento — solo pacientes */}
          {isPatient && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                bgcolor: "#F9FAFB",
                border: "1px solid #F3F4F6",
                borderRadius: 1.5,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#374151",
                  }}
                >
                  Tomando medicamentos
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 12,
                    color: "#9CA3AF",
                    fontWeight: 300,
                  }}
                >
                  ¿El paciente está en tratamiento actualmente?
                </Typography>
              </Box>
              <Switch
                name="status"
                checked={formData.status}
                onChange={handleChange}
                disabled={loading}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#0D1117" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    bgcolor: "#0D1117",
                  },
                }}
              />
            </Box>
          )}

          {/* Notas */}
          <Box>
            <Typography sx={labelStyle}>
              Notas adicionales{" "}
              <span style={{ color: "#9CA3AF", fontWeight: 300 }}>
                (opcional)
              </span>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={loading}
              placeholder="Observaciones, historial relevante…"
              sx={{
                ...inputStyle,
                "& .MuiOutlinedInput-root": {
                  ...inputStyle["& .MuiOutlinedInput-root"],
                  alignItems: "flex-start",
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          px: 3,
          py: 2.5,
          borderTop: "1px solid #F3F4F6",
          mt: 1,
        }}
      >
        <Button onClick={handleClose} disabled={loading} sx={cancelBtnStyle}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading} sx={submitBtnStyle}>
          {loading ? (
            <CircularProgress size={16} sx={{ color: "#9CA3AF" }} />
          ) : (
            "Agregar evaluado"
          )}
        </Button>
      </Box>
    </Dialog>
  );
};

const labelStyle = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: 12,
  fontWeight: 500,
  color: "#374151",
  mb: 0.75,
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontFamily: '"DM Sans", sans-serif',
    fontSize: 13,
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#E5E7EB", borderWidth: 1 },
    "&:hover fieldset": { borderColor: "#9CA3AF" },
    "&.Mui-focused fieldset": { borderColor: "#0D1117", borderWidth: 1.5 },
  },
  "& input": { py: 1.25, px: 1.5, color: "#0D1117" },
  "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
  "& textarea": {
    color: "#0D1117",
    fontFamily: '"DM Sans", sans-serif',
    fontSize: 13,
  },
};

const selectStyle = {
  borderRadius: 1.5,
  fontFamily: '"DM Sans", sans-serif',
  fontSize: 13,
  bgcolor: "#fff",
  height: 44,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9CA3AF" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#0D1117",
    borderWidth: 1.5,
  },
};

const cancelBtnStyle = {
  height: 40,
  px: 2.5,
  border: "1px solid #E5E7EB",
  color: "#6B7280",
  borderRadius: 1.5,
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 400,
  fontSize: 13,
  textTransform: "none",
  "&:hover": { bgcolor: "#F9FAFB" },
};

const submitBtnStyle = {
  height: 40,
  px: 2.5,
  bgcolor: "#0D1117",
  color: "#fff",
  borderRadius: 1.5,
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 500,
  fontSize: 13,
  textTransform: "none",
  "&:hover": { bgcolor: "#1a2332" },
  "&:disabled": { bgcolor: "#F3F4F6", color: "#9CA3AF" },
};

export default EvaluatedForm;
