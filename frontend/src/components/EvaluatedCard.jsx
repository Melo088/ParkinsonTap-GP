import React, { useState } from "react";
import { Box, Typography, Button, Collapse } from "@mui/material";
import {
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  MaleOutlined as MaleIcon,
  FemaleOutlined as FemaleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const EvaluatedCard = ({ evaluated, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleDelete = () => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar la evaluación de ${evaluated.name}?`,
      )
    ) {
      onDelete(evaluated.id);
    }
  };

  const handleCreateTest = (e) => {
    e.stopPropagation();
    navigate(`/test/${evaluated.id}`);
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "—";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const isPatient = evaluated.evaluatedTypeName?.toLowerCase() === "pacientes";
  const gender = evaluated.genreName?.toLowerCase();
  const typeColor = isPatient ? "#EF4444" : "#10B981";

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 2.5,
        overflow: "hidden",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: "#D1D5DB",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      {/* Color stripe */}
      <Box sx={{ height: 3, bgcolor: typeColor }} />

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Avatar */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {gender === "masculino" && (
                <MaleIcon sx={{ fontSize: 18, color: "#3B82F6" }} />
              )}
              {gender === "femenino" && (
                <FemaleIcon sx={{ fontSize: 18, color: "#EC4899" }} />
              )}
              {!gender ||
                (gender !== "masculino" && gender !== "femenino" && (
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#6B7280",
                    }}
                  >
                    {evaluated.name?.[0]?.toUpperCase() ?? "?"}
                  </Typography>
                ))}
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0D1117",
                  lineHeight: 1.3,
                }}
              >
                {evaluated.name || "Sin nombre"}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 12,
                  color: "#9CA3AF",
                  mt: 0.25,
                }}
              >
                {evaluated.genreName || "—"} ·{" "}
                {calculateAge(evaluated.birthDate)} años
              </Typography>
            </Box>
          </Box>

          {/* Type badge */}
          <Box
            sx={{
              px: 1.25,
              py: 0.4,
              bgcolor: `${typeColor}12`,
              border: `1px solid ${typeColor}30`,
              borderRadius: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 11,
                fontWeight: 600,
                color: typeColor,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {isPatient ? "Paciente" : "Control"}
            </Typography>
          </Box>
        </Box>

        {/* Stats row */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2.5,
            pb: 2.5,
            borderBottom: "1px solid #F3F4F6",
          }}
        >
          <Stat
            label="Altura"
            value={evaluated.height ? `${evaluated.height} cm` : "—"}
          />
          <Box sx={{ width: "1px", bgcolor: "#F3F4F6" }} />
          <Stat
            label="Peso"
            value={evaluated.weight ? `${evaluated.weight} kg` : "—"}
          />
          {isPatient && (
            <>
              <Box sx={{ width: "1px", bgcolor: "#F3F4F6" }} />
              <Stat
                label="Medicamento"
                value={evaluated.status ? "Sí" : "No"}
                valueColor={evaluated.status ? "#10B981" : "#6B7280"}
              />
            </>
          )}
        </Box>

        {/* Notes toggle */}
        <Box
          onClick={() => setExpanded(!expanded)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            cursor: "pointer",
            mb: expanded ? 1.5 : 0,
            width: "fit-content",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 12,
              color: "#6B7280",
              fontWeight: 400,
            }}
          >
            {expanded ? "Ocultar notas" : "Ver notas"}
          </Typography>
          {expanded ? (
            <ExpandLessIcon sx={{ fontSize: 14, color: "#9CA3AF" }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 14, color: "#9CA3AF" }} />
          )}
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              p: 2,
              bgcolor: "#F9FAFB",
              border: "1px solid #F3F4F6",
              borderRadius: 1.5,
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                color: "#374151",
                fontWeight: 300,
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
              }}
            >
              {evaluated.notes || "Sin notas registradas."}
            </Typography>
          </Box>
        </Collapse>
      </Box>

      {/* Footer actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderTop: "1px solid #F3F4F6",
          bgcolor: "#FAFAFA",
        }}
      >
        <Button
          size="small"
          startIcon={<AssessmentIcon sx={{ fontSize: 14 }} />}
          onClick={handleCreateTest}
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
            fontWeight: 500,
            color: "#fff",
            bgcolor: "#0D1117",
            textTransform: "none",
            height: 34,
            px: 2,
            borderRadius: 1.5,
            "&:hover": { bgcolor: "#1a2332" },
          }}
        >
          Crear test
        </Button>

        <Button
          size="small"
          startIcon={<DeleteIcon sx={{ fontSize: 13 }} />}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
            fontWeight: 400,
            color: "#EF4444",
            textTransform: "none",
            p: 0,
            minWidth: 0,
            "&:hover": { bgcolor: "transparent", color: "#DC2626" },
          }}
        >
          Eliminar
        </Button>
      </Box>
    </Box>
  );
};

const Stat = ({ label, value, valueColor = "#0D1117" }) => (
  <Box sx={{ flex: 1 }}>
    <Typography
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 10,
        fontWeight: 500,
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        mb: 0.25,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 13,
        fontWeight: 600,
        color: valueColor,
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default EvaluatedCard;
