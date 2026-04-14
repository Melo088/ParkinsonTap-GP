import React from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  Delete as DeleteIcon,
  ShowChart as ShowChartIcon,
  Analytics as AnalyticsIcon,
  DeleteSweep as DeleteSweepIcon,
  LocalHospital,
  HealthAndSafety,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TestCard = ({ test, onDelete, onDataDelete, currentDoctorEmail }) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar el test "${test.name}"?`,
      )
    ) {
      onDelete(test.testId);
    }
  };

  const handleDeleteData = () => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar los datos del test "${test.name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      onDataDelete(test.testId);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString + "Z");
      return date.toLocaleString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const canDelete =
    !test.doctorEmail || currentDoctorEmail === test.doctorEmail;
  const isPatient =
    test.evaluated?.evaluatedTypeName?.toLowerCase() === "pacientes";
  const typeColor = isPatient ? "#EF4444" : "#10B981";

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 2.5,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: "#D1D5DB",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      {/* Top bar */}
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
            {test.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 11,
              color: "#9CA3AF",
              mt: 0.25,
            }}
          >
            #{test.testId}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexShrink: 0,
            ml: 2,
          }}
        >
          {/* Side badge */}
          <Box
            sx={{
              px: 1.25,
              py: 0.4,
              bgcolor: "#FFF7ED",
              border: "1px solid #FED7AA",
              borderRadius: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 11,
                fontWeight: 600,
                color: "#C2410C",
              }}
            >
              {test.evalAxis ? "Izquierdo" : "Derecho"}
            </Typography>
          </Box>

          {/* Has data indicator */}
          {test.hasData && (
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: "#10B981",
              }}
              title="Con datos"
            />
          )}
        </Box>
      </Box>

      {/* Body */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexGrow: 1,
        }}
      >
        {/* Description */}
        {test.description && (
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              color: "#6B7280",
              fontWeight: 300,
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {test.description}
          </Typography>
        )}

        {/* Evaluado */}
        <InfoRow
          icon={
            isPatient ? (
              <LocalHospital sx={{ fontSize: 14, color: typeColor }} />
            ) : (
              <HealthAndSafety sx={{ fontSize: 14, color: typeColor }} />
            )
          }
          label="Evaluado"
          value={
            <>
              {test.evaluated?.firstName} {test.evaluated?.lastName}
              <Box
                component="span"
                sx={{
                  ml: 1,
                  px: 1,
                  py: 0.15,
                  bgcolor: `${typeColor}12`,
                  border: `1px solid ${typeColor}30`,
                  borderRadius: 0.75,
                  fontSize: 10,
                  fontWeight: 600,
                  color: typeColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  verticalAlign: "middle",
                }}
              >
                {isPatient ? "Paciente" : "Control"}
              </Box>
            </>
          }
        />

        {/* Doctor */}
        <InfoRow
          label="Doctor"
          value={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>
                Dr. {test.doctorFirstName} {test.doctorLastName}
              </span>
              {canDelete && (
                <Box
                  sx={{
                    px: 1,
                    py: 0.15,
                    bgcolor: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    borderRadius: 0.75,
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#166534",
                  }}
                >
                  Tú
                </Box>
              )}
            </Box>
          }
        />

        {/* Date */}
        <InfoRow label="Creado" value={formatDate(test.dateTime)} />
      </Box>

      {/* Footer actions */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #F3F4F6",
          bgcolor: "#FAFAFA",
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {/* Tomar medidas — solo si NO tiene datos */}
        {!test.hasData && (
          <ActionBtn
            icon={<AnalyticsIcon sx={{ fontSize: 14 }} />}
            label="Tomar medidas"
            onClick={() => navigate(`/acquisition/${test.testId}`)}
            variant="primary"
          />
        )}

        {/* Ver gráficos — solo si tiene datos */}
        {test.hasData && (
          <ActionBtn
            icon={<ShowChartIcon sx={{ fontSize: 14 }} />}
            label="Ver gráficos"
            onClick={() => navigate(`/grafica/${test.testId}`)}
            variant="primary"
          />
        )}

        {canDelete && (
          <ActionBtn
            icon={<DeleteIcon sx={{ fontSize: 13 }} />}
            label="Eliminar test"
            onClick={handleDelete}
            variant="danger"
          />
        )}

        {canDelete && test.hasData && (
          <ActionBtn
            icon={<DeleteSweepIcon sx={{ fontSize: 13 }} />}
            label="Eliminar datos"
            onClick={handleDeleteData}
            variant="warning"
          />
        )}
      </Box>
    </Box>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
    {icon && <Box sx={{ mt: 0.2, flexShrink: 0 }}>{icon}</Box>}
    <Box sx={{ minWidth: 0 }}>
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
      {/* Añadimos component="div" */}
      <Typography
        component="div"
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 13,
          color: "#374151",
          lineHeight: 1.4,
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

const ActionBtn = ({ icon, label, onClick, variant }) => {
  const styles = {
    primary: {
      color: "#fff",
      bgcolor: "#0D1117",
      "&:hover": { bgcolor: "#1a2332" },
    },
    danger: {
      color: "#EF4444",
      bgcolor: "transparent",
      border: "1px solid #FECACA",
      "&:hover": { bgcolor: "#FEF2F2" },
    },
    warning: {
      color: "#D97706",
      bgcolor: "transparent",
      border: "1px solid #FDE68A",
      "&:hover": { bgcolor: "#FFFBEB" },
    },
  };

  return (
    <Button
      size="small"
      startIcon={icon}
      onClick={onClick}
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 12,
        fontWeight: 500,
        textTransform: "none",
        height: 32,
        px: 1.75,
        borderRadius: 1.5,
        ...styles[variant],
      }}
    >
      {label}
    </Button>
  );
};

export default TestCard;
