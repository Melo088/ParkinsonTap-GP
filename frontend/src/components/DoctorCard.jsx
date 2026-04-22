import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const DoctorCard = ({ doctor, onDelete }) => {
  console.log("DoctorCard props:", doctor);

  const handleDelete = () => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar al Dr. ${doctor.firstName} ${doctor.lastName}?`,
      )
    ) {
      onDelete(doctor.id);
    }
  };

  const initials =
    `${doctor.firstName?.[0] ?? ""}${doctor.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 2.5,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: "#D1D5DB",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "#0D1117",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: "#4ECBA0",
              letterSpacing: "0.02em",
            }}
          >
            {initials}
          </Typography>
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 15,
              fontWeight: 600,
              color: "#0D1117",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Dr. {doctor.firstName} {doctor.lastName}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 12,
              color: "#9CA3AF",
              mt: 0.25,
            }}
          >
            {doctor.role?.roleName || "DOCTOR"}
          </Typography>
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ height: "1px", bgcolor: "#F3F4F6" }} />

      {/* Details */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Row label="Email" value={doctor.email} />
        <Row label="Especialidad" value={doctor.speciality || "—"} />
        <Row label="Centro médico" value={doctor.medicalCenter || "—"} />
      </Box>

      {/* Footer */}
      <Box sx={{ pt: 0.5 }}>
        <Button
          startIcon={<DeleteIcon sx={{ fontSize: 14 }} />}
          onClick={handleDelete}
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
            fontWeight: 500,
            color: "#EF4444",
            textTransform: "none",
            p: 0,
            minWidth: 0,
            "&:hover": { bgcolor: "transparent", color: "#DC2626" },
          }}
        >
          Eliminar doctor
        </Button>
      </Box>
    </Box>
  );
};

const Row = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 2,
    }}
  >
    <Typography
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 11,
        fontWeight: 500,
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 13,
        color: "#374151",
        fontWeight: 400,
        textAlign: "right",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "65%",
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default DoctorCard;
