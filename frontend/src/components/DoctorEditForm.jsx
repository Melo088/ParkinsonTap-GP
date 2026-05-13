import React, { useState, useEffect } from "react";
import {
  Drawer,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon, EditOutlined as EditIcon } from "@mui/icons-material";
import { doctorService } from "../services/doctorService";

const DoctorEditForm = ({ open, onClose, doctor, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    speciality: "",
    medicalCenter: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (doctor) {
      setFormData({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        speciality: doctor.speciality || "",
        medicalCenter: doctor.medicalCenter || "",
      });
      setError("");
      setFieldErrors({});
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateFields = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = true;
    if (!formData.lastName.trim()) errors.lastName = true;
    return errors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Nombre y apellido son obligatorios.");
      return;
    }
    setLoading(true);
    try {
      const updated = await doctorService.updateDoctor(doctor.id, formData);
      onSuccess(updated);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  const fields = [
    { name: "firstName", label: "Nombre", half: true },
    { name: "lastName", label: "Apellido", half: true },
    { name: "speciality", label: "Especialidad", half: false },
    { name: "medicalCenter", label: "Centro médico", half: false },
  ];

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
              bgcolor: "#EBF2FB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditIcon sx={{ fontSize: 18, color: "#1B4F8A" }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 16, fontWeight: 600, color: "#111827" }}>
              Editar doctor
            </Typography>
            {doctor && (
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "#6B7280", fontWeight: 300 }}>
                Dr. {doctor.firstName} {doctor.lastName}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton onClick={handleClose} disabled={loading} size="small" sx={{ color: "#9CA3AF" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
        {error && (
          <Box sx={{ mb: 3, p: 2, bgcolor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 1.5 }}>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#B91C1C" }}>
              {error}
            </Typography>
          </Box>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5 }}
        >
          {fields.map(({ name, label, half }) => (
            <Box key={name} sx={{ gridColumn: half ? "span 1" : "span 2" }}>
              <Typography sx={labelStyle}>{label}</Typography>
              <TextField
                name={name}
                value={formData[name]}
                onChange={handleChange}
                disabled={loading}
                error={!!fieldErrors[name]}
                fullWidth
                placeholder={label}
                sx={inputStyle(!!fieldErrors[name])}
              />
              {fieldErrors[name] && (
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#DC2626", mt: 0.5 }}>
                  Campo requerido
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Email — readonly info */}
        {doctor?.email && (
          <Box sx={{ mt: 3, p: 2, bgcolor: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: 1.5 }}>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#94A3B8", mb: 0.25 }}>
              Correo electrónico (no editable)
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#475569" }}>
              {doctor.email}
            </Typography>
          </Box>
        )}
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

const inputStyle = (hasError) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontFamily: '"DM Sans", sans-serif',
    fontSize: 13,
    bgcolor: "#fff",
    "& fieldset": { borderColor: hasError ? "#FCA5A5" : "#E2E8F0", borderWidth: 1 },
    "&:hover fieldset": { borderColor: hasError ? "#F87171" : "#9CA3AF" },
    "&.Mui-focused fieldset": { borderColor: hasError ? "#DC2626" : "#1B4F8A", borderWidth: 1.5 },
  },
  "& input": { py: 1.25, px: 1.5, color: "#111827" },
  "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
});

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
  "&:hover": { bgcolor: "#F0F4F8" },
};

const submitBtnStyle = {
  height: 40,
  px: 2.5,
  bgcolor: "#1B4F8A",
  color: "#fff",
  borderRadius: 1.5,
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 500,
  fontSize: 13,
  textTransform: "none",
  "&:hover": { bgcolor: "#153D6B" },
  "&:disabled": { bgcolor: "#F3F4F6", color: "#9CA3AF" },
};

export default DoctorEditForm;
