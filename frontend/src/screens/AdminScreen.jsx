import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { doctorService } from "../services/doctorService";
import DoctorCard from "../components/DoctorCard";
import DoctorForm from "../components/DoctorForm";
import Grid from "@mui/material/Grid";

console.log("AdminScreen loaded");

const AdminScreen = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const doctorsData = await doctorService.getAllDoctors();
      setDoctors(doctorsData);
      setError("");
    } catch (error) {
      setError("Error al cargar los doctores: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (doctorData) => {
    try {
      await doctorService.registerDoctor(doctorData);
      await loadDoctors();
      setError("");
      setSuccess("Doctor agregado correctamente.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error al agregar doctor: " + error.message);
      setSuccess("");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      await doctorService.deleteDoctor(doctorId);
      await loadDoctors();
      setError("");
      setSuccess("Doctor eliminado correctamente.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error al eliminar doctor: " + error.message);
      setSuccess("");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F7F6F3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={32} sx={{ color: "#0D1117", mb: 2 }} />
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              color: "#9CA3AF",
            }}
          >
            Cargando panel…
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F6F3", pb: 10 }}>
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        {/* Page header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 6,
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
              Panel de administración
            </Typography>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 14,
                color: "#6B7280",
                fontWeight: 300,
              }}
            >
              Gestiona los doctores registrados en el sistema
            </Typography>
          </Box>

          <Button
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => setOpenForm(true)}
            sx={primaryBtnStyle}
          >
            Nuevo doctor
          </Button>
        </Box>

        {/* Toasts */}
        {(success || error) && (
          <Box
            sx={{
              mb: 4,
              p: 2,
              bgcolor: success ? "#ECFDF5" : "#FEF2F2",
              border: `1px solid ${success ? "#A7F3D0" : "#FECACA"}`,
              borderRadius: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                color: success ? "#065F46" : "#B91C1C",
              }}
            >
              {success || error}
            </Typography>
          </Box>
        )}

        {/* Stats bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            pb: 3,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              color: "#6B7280",
            }}
          >
            {doctors.length}{" "}
            {doctors.length === 1
              ? "doctor registrado"
              : "doctores registrados"}
          </Typography>
        </Box>

        {/* Grid */}
        {doctors.length === 0 ? (
          <EmptyState onAdd={() => setOpenForm(true)} />
        ) : (
          <Grid container spacing={2.5}>
            {doctors.map((doctor) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doctor.id}>
                <DoctorCard doctor={doctor} onDelete={handleDeleteDoctor} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* FAB */}
      {doctors.length > 0 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 28,
            right: 28,
          }}
        >
          <Button
            onClick={() => setOpenForm(true)}
            sx={{
              height: 48,
              px: 3,
              bgcolor: "#0D1117",
              color: "#fff",
              borderRadius: 2,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 500,
              fontSize: 13,
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              "&:hover": { bgcolor: "#1a2332" },
              gap: 1,
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} /> Nuevo doctor
          </Button>
        </Box>
      )}

      <DoctorForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={handleAddDoctor}
      />
    </Box>
  );
};

const EmptyState = ({ onAdd }) => (
  <Box
    sx={{
      bgcolor: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: 2.5,
      py: 10,
      textAlign: "center",
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        bgcolor: "#F3F4F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: "auto",
        mb: 2.5,
      }}
    >
      <AddIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />
    </Box>
    <Typography
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 15,
        fontWeight: 500,
        color: "#374151",
        mb: 1,
      }}
    >
      Sin doctores registrados
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
      Agrega el primer profesional al sistema
    </Typography>
    <Button onClick={onAdd} sx={primaryBtnStyle}>
      Agregar doctor
    </Button>
  </Box>
);

const primaryBtnStyle = {
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

export default AdminScreen;
