import React, { useState, useEffect } from "react";
import {
  Drawer,
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
import { Close as CloseIcon, EditOutlined as EditIcon } from "@mui/icons-material";
import { evaluatedService } from "../services/evaluatedService";

const EvaluatedEditForm = ({ open, onClose, evaluated, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "",
    evaluatedType: "",
    height: "",
    weight: "",
    status: false,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const evaluatedTypes = [
    { id: 1, name: "PACIENTES" },
    { id: 2, name: "CONTROLES" },
  ];

  useEffect(() => {
    if (evaluated) {
      const typeId =
        evaluated.evaluatedTypeName?.toUpperCase() === "PACIENTES" ? 1 : 2;
      setFormData({
        name: evaluated.name || "",
        birthDate: evaluated.birthDate
          ? (typeof evaluated.birthDate === "string"
              ? evaluated.birthDate.split("T")[0]
              : evaluated.birthDate)
          : "",
        gender: evaluated.genreName?.toUpperCase() || "",
        evaluatedType: typeId,
        height: evaluated.height?.toString() || "",
        weight: evaluated.weight?.toString() || "",
        status: evaluated.status ?? false,
        notes: evaluated.notes || "",
      });
      setError("");
    }
  }, [evaluated]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const selectedType = evaluatedTypes.find((t) => t.id === formData.evaluatedType);
      const payload = {
        name: formData.name,
        birthDate: formData.birthDate || null,
        genreName: formData.gender || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        notes: formData.notes,
        evaluatedTypeName: selectedType?.name || null,
        status: selectedType?.name === "PACIENTES" ? formData.status : false,
      };
      const updated = await evaluatedService.updateEvaluated(evaluated.id, payload);
      onSuccess(updated);
      onClose();
    } catch (err) {
      setError(err.message || "Error al actualizar el evaluado");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  const selectedType = evaluatedTypes.find((t) => t.id === formData.evaluatedType);
  const isPatient = selectedType?.name === "PACIENTES";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 480 },
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fff",
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
          py: 2.5,
          borderBottom: "1px solid #F3F4F6",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: "#F0FDF4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditIcon sx={{ fontSize: 18, color: "#059669" }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 16, fontWeight: 600, color: "#111827" }}>
              Editar evaluado
            </Typography>
            {evaluated && (
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "#6B7280", fontWeight: 300 }}>
                {evaluated.name}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton onClick={handleClose} disabled={loading} size="small" sx={{ color: "#9CA3AF" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        {error && (
          <Box sx={{ p: 2, bgcolor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 1.5 }}>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#B91C1C" }}>
              {error}
            </Typography>
          </Box>
        )}

        {/* Nombre */}
        <Box>
          <Typography sx={labelStyle}>Nombre completo</Typography>
          <TextField
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            placeholder="Juan García"
            sx={inputStyle}
          />
        </Box>

        {/* Fecha + Género */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box>
            <Typography sx={labelStyle}>Fecha de nacimiento</Typography>
            <TextField
              fullWidth
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
              sx={inputStyle}
            />
          </Box>
          <Box>
            <Typography sx={labelStyle}>Género</Typography>
            <Select
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

        {/* Altura + Peso */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box>
            <Typography sx={labelStyle}>Altura (cm)</Typography>
            <TextField
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
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 500, color: "#374151" }}>
                Tomando medicamentos
              </Typography>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "#9CA3AF", fontWeight: 300 }}>
                ¿El paciente está en tratamiento actualmente?
              </Typography>
            </Box>
            <Switch
              name="status"
              checked={formData.status}
              onChange={handleChange}
              disabled={loading}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#1B4F8A" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#1B4F8A" },
              }}
            />
          </Box>
        )}

        {/* Notas */}
        <Box>
          <Typography sx={labelStyle}>
            Notas adicionales{" "}
            <span style={{ color: "#9CA3AF", fontWeight: 300 }}>(opcional)</span>
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

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          px: 3,
          py: 2.5,
          borderTop: "1px solid #F3F4F6",
          bgcolor: "#fff",
          flexShrink: 0,
        }}
      >
        <Button onClick={handleClose} disabled={loading} sx={cancelBtnStyle}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading} sx={submitBtnStyle}>
          {loading ? <CircularProgress size={16} sx={{ color: "#9CA3AF" }} /> : "Guardar cambios"}
        </Button>
      </Box>
    </Drawer>
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
    "& fieldset": { borderColor: "#E2E8F0", borderWidth: 1 },
    "&:hover fieldset": { borderColor: "#9CA3AF" },
    "&.Mui-focused fieldset": { borderColor: "#1B4F8A", borderWidth: 1.5 },
  },
  "& input": { py: 1.25, px: 1.5, color: "#111827" },
  "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
  "& textarea": {
    color: "#111827",
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
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0", borderWidth: 1 },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9CA3AF" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1B4F8A", borderWidth: 1.5 },
};

const cancelBtnStyle = {
  height: 40,
  px: 2.5,
  border: "1px solid #E2E8F0",
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
  bgcolor: "#059669",
  color: "#fff",
  borderRadius: 1.5,
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 500,
  fontSize: 13,
  textTransform: "none",
  "&:hover": { bgcolor: "#047857" },
  "&:disabled": { bgcolor: "#F3F4F6", color: "#9CA3AF" },
};

export default EvaluatedEditForm;
