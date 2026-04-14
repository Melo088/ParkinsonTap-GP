import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const DoctorForm = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    speciality: "",
    medicalCenter: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateFields = () => {
    const errors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) errors[key] = true;
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await onSuccess(formData);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        speciality: "",
        medicalCenter: "",
      });
      setFieldErrors({});
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        speciality: "",
        medicalCenter: "",
      });
      setError("");
      setFieldErrors({});
      onClose();
    }
  };

  const fields = [
    { name: "firstName", label: "Nombre", type: "text" },
    { name: "lastName", label: "Apellido", type: "text" },
    { name: "email", label: "Correo electrónico", type: "email" },
    { name: "password", label: "Contraseña", type: "password" },
    { name: "speciality", label: "Especialidad", type: "text" },
    { name: "medicalCenter", label: "Centro médico", type: "text" },
  ];

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
            Nuevo doctor
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
            Completa los datos del profesional
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
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
        >
          {fields.map(({ name, label, type }) => (
            <Box
              key={name}
              sx={{
                gridColumn:
                  name === "email" || name === "medicalCenter"
                    ? "span 2"
                    : "span 1",
              }}
            >
              <Typography sx={labelStyle}>{label}</Typography>
              <TextField
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                disabled={loading}
                error={!!fieldErrors[name]}
                fullWidth
                placeholder={label}
                sx={inputStyle(!!fieldErrors[name])}
              />
              {fieldErrors[name] && (
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 11,
                    color: "#EF4444",
                    mt: 0.5,
                  }}
                >
                  Campo requerido
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>

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
            "Agregar doctor"
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

const inputStyle = (hasError) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontFamily: '"DM Sans", sans-serif',
    fontSize: 13,
    bgcolor: "#fff",
    "& fieldset": {
      borderColor: hasError ? "#FCA5A5" : "#E5E7EB",
      borderWidth: 1,
    },
    "&:hover fieldset": { borderColor: hasError ? "#F87171" : "#9CA3AF" },
    "&.Mui-focused fieldset": {
      borderColor: hasError ? "#EF4444" : "#0D1117",
      borderWidth: 1.5,
    },
  },
  "& input": { py: 1.25, px: 1.5, color: "#0D1117" },
  "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
});

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

export default DoctorForm;
