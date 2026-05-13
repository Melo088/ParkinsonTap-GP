import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  Delete as DeleteIcon,
  ShowChart as ShowChartIcon,
  Analytics as AnalyticsIcon,
  DeleteSweep as DeleteSweepIcon,
  Assessment as AssessmentIcon,
  LocalHospital,
  HealthAndSafety,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";

const TestCard = ({ test, onDelete, onDataDelete, currentDoctorEmail }) => {
  const navigate = useNavigate();
  const [deleteTestOpen, setDeleteTestOpen] = useState(false);
  const [deleteDataOpen, setDeleteDataOpen] = useState(false);

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

  const canDelete = !test.doctorEmail || currentDoctorEmail === test.doctorEmail;
  const isPatient = test.evaluated?.evaluatedTypeName?.toLowerCase() === "pacientes";
  const typeColor = isPatient ? "#DC2626" : "#059669";

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 2.5,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: "#CBD5E1",
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
              color: "#111827",
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0, ml: 2 }}>
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
              sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#059669" }}
              title="Con datos"
            />
          )}
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, py: 2.5, display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
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

        <InfoRow
          label="Doctor"
          value={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>Dr. {test.doctorFirstName} {test.doctorLastName}</span>
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
        {!test.hasData && (
          <ActionBtn
            icon={<AnalyticsIcon sx={{ fontSize: 14 }} />}
            label="Tomar medidas"
            onClick={() => navigate(`/acquisition/${test.testId}`)}
            variant="primary"
          />
        )}

        {test.hasData && (
          <ActionBtn
            icon={<ShowChartIcon sx={{ fontSize: 14 }} />}
            label="Ver gráficos"
            onClick={() => navigate(`/grafica/${test.testId}`)}
            variant="primary"
          />
        )}

        {test.hasData && (
          <ActionBtn
            icon={<AssessmentIcon sx={{ fontSize: 14 }} />}
            label="Ver informe"
            onClick={() => navigate(`/informe/${test.testId}`)}
            variant="secondary"
          />
        )}

        {canDelete && (
          <ActionBtn
            icon={<DeleteIcon sx={{ fontSize: 13 }} />}
            label="Eliminar test"
            onClick={() => setDeleteTestOpen(true)}
            variant="danger"
          />
        )}

        {canDelete && test.hasData && (
          <ActionBtn
            icon={<DeleteSweepIcon sx={{ fontSize: 13 }} />}
            label="Eliminar datos"
            onClick={() => setDeleteDataOpen(true)}
            variant="warning"
          />
        )}
      </Box>

      {/* Confirm: delete test */}
      <ConfirmDialog
        open={deleteTestOpen}
        title="Eliminar test"
        message={`¿Estás seguro de que deseas eliminar el test "${test.name}"? Esta acción eliminará también todos los datos asociados.`}
        confirmLabel="Eliminar test"
        severity="danger"
        onConfirm={() => { setDeleteTestOpen(false); onDelete(test.testId); }}
        onCancel={() => setDeleteTestOpen(false)}
      />

      {/* Confirm: delete data only */}
      <ConfirmDialog
        open={deleteDataOpen}
        title="Eliminar datos del test"
        message={`¿Estás seguro de que deseas eliminar los datos del test "${test.name}"? El test se conservará pero deberás volver a tomar las medidas.`}
        confirmLabel="Eliminar datos"
        severity="warning"
        onConfirm={() => { setDeleteDataOpen(false); onDataDelete(test.testId); }}
        onCancel={() => setDeleteDataOpen(false)}
      />
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
      <Typography
        component="div"
        sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#374151", lineHeight: 1.4 }}
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
      bgcolor: "#1B4F8A",
      "&:hover": { bgcolor: "#153D6B" },
    },
    danger: {
      color: "#DC2626",
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
    secondary: {
      color: "#1B4F8A",
      bgcolor: "transparent",
      border: "1px solid #BFDBFE",
      "&:hover": { bgcolor: "#EBF2FB" },
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
