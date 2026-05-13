import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Skeleton,
  TextField,
  InputAdornment,
  Fade,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { doctorService } from "../services/doctorService";
import DoctorCard from "../components/DoctorCard";
import DoctorForm from "../components/DoctorForm";
import DoctorEditForm from "../components/DoctorEditForm";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "../context/SnackbarContext";

const AdminScreen = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [search, setSearch] = useState("");
  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const doctorsData = await doctorService.getAllDoctors();
      setDoctors(doctorsData);
    } catch (error) {
      showError("Error al cargar los doctores: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (doctorData) => {
    try {
      await doctorService.registerDoctor(doctorData);
      await loadDoctors();
      showSuccess("Doctor agregado correctamente.");
    } catch (error) {
      showError("Error al agregar doctor: " + error.message);
    }
  };

  const handleUpdateDoctor = (updatedDoctor) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === updatedDoctor.id ? updatedDoctor : d))
    );
    showSuccess("Doctor actualizado correctamente.");
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      await doctorService.deleteDoctor(doctorId);
      await loadDoctors();
      showSuccess("Doctor eliminado correctamente.");
    } catch (error) {
      showError("Error al eliminar doctor: " + error.message);
    }
  };

  const filteredDoctors = doctors.filter((d) => {
    const q = search.toLowerCase();
    return (
      !q ||
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q) ||
      d.speciality?.toLowerCase().includes(q) ||
      d.medicalCenter?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F0F4F8", pb: 10 }}>
        <Container maxWidth="lg" sx={{ pt: 6 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 6, gap: 3 }}>
            <Box>
              <Skeleton width={260} height={36} sx={{ borderRadius: 1 }} />
              <Skeleton width={200} height={20} sx={{ borderRadius: 1, mt: 0.5 }} />
            </Box>
            <Skeleton width={130} height={42} sx={{ borderRadius: 1.5 }} />
          </Box>
          <Skeleton width={240} height={44} sx={{ borderRadius: 1.5, mb: 4 }} />
          <Grid container spacing={2.5}>
            {[1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <DoctorCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F0F4F8", pb: 10 }}>
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        {/* Page header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 5,
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 28, fontWeight: 600, color: "#111827", mb: 0.5 }}>
              Panel de administración
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: "#4B5563", fontWeight: 300 }}>
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

        {/* Search + stats row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            pb: 3,
            borderBottom: "1px solid #E2E8F0",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Buscar por nombre, email o especialidad…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: 300 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                bgcolor: "#fff",
                "& fieldset": { borderColor: "#E2E8F0" },
                "&:hover fieldset": { borderColor: "#9CA3AF" },
                "&.Mui-focused fieldset": { borderColor: "#1B4F8A", borderWidth: 1.5 },
              },
              "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
          />
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#4B5563", flexShrink: 0 }}>
            {filteredDoctors.length === doctors.length
              ? `${doctors.length} ${doctors.length === 1 ? "doctor" : "doctores"}`
              : `${filteredDoctors.length} de ${doctors.length} doctores`}
          </Typography>
        </Box>

        {/* Grid */}
        {doctors.length === 0 ? (
          <EmptyState onAdd={() => setOpenForm(true)} />
        ) : filteredDoctors.length === 0 ? (
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 2.5,
              py: 8,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: "#6B7280" }}>
              No hay resultados para "{search}"
            </Typography>
            <Button
              onClick={() => setSearch("")}
              sx={{ mt: 2, fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#1B4F8A", textTransform: "none" }}
            >
              Limpiar búsqueda
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filteredDoctors.map((doctor, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doctor.id}>
                <Fade in timeout={400} style={{ transitionDelay: `${index * 70}ms` }}>
                  <Box>
                    <DoctorCard
                      doctor={doctor}
                      onDelete={handleDeleteDoctor}
                      onEdit={(doc) => setEditingDoctor(doc)}
                    />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <DoctorForm open={openForm} onClose={() => setOpenForm(false)} onSuccess={handleAddDoctor} />
      <DoctorEditForm
        open={!!editingDoctor}
        doctor={editingDoctor}
        onClose={() => setEditingDoctor(null)}
        onSuccess={handleUpdateDoctor}
      />
    </Box>
  );
};

const DoctorCardSkeleton = () => (
  <Box
    sx={{
      bgcolor: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: 2.5,
      overflow: "hidden",
    }}
  >
    <Skeleton variant="rectangular" height={3} sx={{ bgcolor: "#E2E8F0" }} />
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
        <Skeleton variant="circular" width={42} height={42} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="65%" height={20} sx={{ mb: 0.75 }} />
          <Skeleton width="35%" height={16} />
        </Box>
      </Box>
      <Skeleton height={1} sx={{ mb: 2.5 }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Skeleton height={16} />
        <Skeleton height={16} />
        <Skeleton height={16} />
      </Box>
    </Box>
    <Skeleton variant="rectangular" height={44} sx={{ mx: 3, mb: 3, borderRadius: 1 }} />
  </Box>
);

const EmptyState = ({ onAdd }) => (
  <Box
    sx={{
      bgcolor: "#fff",
      border: "1px solid #E2E8F0",
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
    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, fontWeight: 500, color: "#374151", mb: 1 }}>
      Sin doctores registrados
    </Typography>
    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#9CA3AF", fontWeight: 300, mb: 4 }}>
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
  bgcolor: "#1B4F8A",
  color: "#fff",
  borderRadius: 1.5,
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 500,
  fontSize: 13,
  textTransform: "none",
  "&:hover": { bgcolor: "#153D6B" },
};

export default AdminScreen;
