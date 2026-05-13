import React, { useState } from "react";
import { Box, Typography, Button, Collapse, Chip } from "@mui/material";
import {
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  MaleOutlined as MaleIcon,
  FemaleOutlined as FemaleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Science as ScienceIcon,
  Edit as EditIcon,
  CalendarTodayOutlined as CalendarIcon,
  HeightOutlined as HeightIcon,
  MonitorWeightOutlined as WeightIcon,
  MedicationOutlined as MedIcon,
  NoteAltOutlined as NoteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";

const EvaluatedCard = ({ evaluated, onDelete, onEdit }) => {
  const [testsExpanded, setTestsExpanded] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

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
  const typeColor = isPatient ? "#DC2626" : "#059669";
  const typeBg = isPatient ? "#FEF2F2" : "#F0FDF4";
  const typeBorder = isPatient ? "#FECACA" : "#BBF7D0";
  const testCount = evaluated.tests?.length ?? 0;

  const sortedTests = evaluated.tests
    ? [...evaluated.tests].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
    : [];

  const lastTestDate = sortedTests[0]?.dateTime
    ? new Date(sortedTests[0].dateTime).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const avatarBg = gender === "masculino" ? "#EFF6FF" : gender === "femenino" ? "#FDF2F8" : "#F8FAFC";
  const avatarIconColor = gender === "masculino" ? "#3B82F6" : gender === "femenino" ? "#EC4899" : "#64748B";

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E8EEF6",
        borderLeft: `3px solid ${typeColor}`,
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.22s ease, transform 0.22s ease",
        "&:hover": {
          boxShadow: `0 4px 8px rgba(0,0,0,0.06), 0 16px 32px ${typeColor}18`,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, pt: 2.75, pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5 }}>
          {/* Avatar + name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, minWidth: 0 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: avatarBg,
                border: `1px solid ${avatarIconColor}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {gender === "masculino" && <MaleIcon sx={{ fontSize: 22, color: avatarIconColor }} />}
              {gender === "femenino" && <FemaleIcon sx={{ fontSize: 22, color: avatarIconColor }} />}
              {(!gender || (gender !== "masculino" && gender !== "femenino")) && (
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#64748B",
                  }}
                >
                  {evaluated.name?.[0]?.toUpperCase() ?? "?"}
                </Typography>
              )}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0F172A",
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {evaluated.name || "Sin nombre"}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 12,
                  color: "#64748B",
                  mt: 0.25,
                }}
              >
                {evaluated.genreName
                  ? evaluated.genreName.charAt(0).toUpperCase() + evaluated.genreName.slice(1).toLowerCase()
                  : "—"}{" "}
                · {calculateAge(evaluated.birthDate)} años
              </Typography>
            </Box>
          </Box>

          {/* Badges */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.75, flexShrink: 0 }}>
            <Box
              sx={{
                px: 1.25,
                py: 0.35,
                bgcolor: typeBg,
                border: `1px solid ${typeBorder}`,
                borderRadius: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 10,
                  fontWeight: 700,
                  color: typeColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {isPatient ? "Paciente" : "Control"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ScienceIcon sx={{ fontSize: 11, color: testCount > 0 ? "#64748B" : "#94A3B8" }} />
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 11,
                  color: testCount > 0 ? "#475569" : "#94A3B8",
                  fontWeight: testCount > 0 ? 600 : 400,
                }}
              >
                {testCount} {testCount === 1 ? "test" : "tests"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Stats bar */}
      <Box
        sx={{
          mx: 3,
          mb: 2,
          p: 2,
          bgcolor: "#F8FAFC",
          border: "1px solid #F1F5F9",
          borderRadius: 2,
          display: "flex",
          gap: 0,
        }}
      >
        <StatCol
          icon={<HeightIcon sx={{ fontSize: 13, color: "#94A3B8" }} />}
          label="Altura"
          value={evaluated.height ? `${evaluated.height} cm` : "—"}
        />
        <Box sx={{ width: "1px", bgcolor: "#E2E8F0", mx: 1.5 }} />
        <StatCol
          icon={<WeightIcon sx={{ fontSize: 13, color: "#94A3B8" }} />}
          label="Peso"
          value={evaluated.weight ? `${evaluated.weight} kg` : "—"}
        />
        {isPatient && (
          <>
            <Box sx={{ width: "1px", bgcolor: "#E2E8F0", mx: 1.5 }} />
            <StatCol
              icon={<MedIcon sx={{ fontSize: 13, color: "#94A3B8" }} />}
              label="Medicamento"
              value={evaluated.status ? "Sí" : "No"}
              valueColor={evaluated.status ? "#059669" : "#64748B"}
            />
          </>
        )}
      </Box>

      {/* Last test + expandables */}
      <Box sx={{ px: 3, pb: 1, flex: 1 }}>
        {lastTestDate && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}>
            <CalendarIcon sx={{ fontSize: 12, color: "#94A3B8" }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#94A3B8" }}>
              Último test:
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#475569", fontWeight: 600 }}>
              {lastTestDate}
            </Typography>
          </Box>
        )}

        {/* Test history toggle */}
        {testCount > 0 && (
          <>
            <Box
              onClick={() => setTestsExpanded(!testsExpanded)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                cursor: "pointer",
                mb: testsExpanded ? 1.25 : 0,
                width: "fit-content",
                "&:hover": { opacity: 0.75 },
              }}
            >
              <ScienceIcon sx={{ fontSize: 13, color: "#1B4F8A" }} />
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 12,
                  color: "#1B4F8A",
                  fontWeight: 500,
                }}
              >
                {testsExpanded ? "Ocultar historial" : `Ver historial (${testCount})`}
              </Typography>
              {testsExpanded ? (
                <ExpandLessIcon sx={{ fontSize: 14, color: "#1B4F8A" }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: 14, color: "#1B4F8A" }} />
              )}
            </Box>

            <Collapse in={testsExpanded} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  mb: 1.5,
                  border: "1px solid #E8EEF6",
                  borderRadius: 1.5,
                  overflow: "hidden",
                }}
              >
                {sortedTests.map((test, idx) => (
                  <Box
                    key={test.testId}
                    sx={{
                      px: 2,
                      py: 1.25,
                      borderBottom: idx < sortedTests.length - 1 ? "1px solid #F1F5F9" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 12,
                        color: "#0F172A",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {test.name || `Test #${test.testId}`}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 11,
                        color: "#94A3B8",
                        flexShrink: 0,
                      }}
                    >
                      {test.dateTime
                        ? new Date(test.dateTime).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </>
        )}

        {/* Notes toggle */}
        {(evaluated.notes) && (
          <>
            <Box
              onClick={() => setNotesExpanded(!notesExpanded)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                cursor: "pointer",
                mt: testCount > 0 ? 0.5 : 0,
                mb: notesExpanded ? 1.25 : 0,
                width: "fit-content",
                "&:hover": { opacity: 0.75 },
              }}
            >
              <NoteIcon sx={{ fontSize: 13, color: "#64748B" }} />
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 12,
                  color: "#64748B",
                  fontWeight: 400,
                }}
              >
                {notesExpanded ? "Ocultar notas" : "Ver notas"}
              </Typography>
              {notesExpanded ? (
                <ExpandLessIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
              )}
            </Box>

            <Collapse in={notesExpanded} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: 1.5,
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 13,
                    color: "#334155",
                    fontWeight: 300,
                    lineHeight: 1.65,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {evaluated.notes}
                </Typography>
              </Box>
            </Collapse>
          </>
        )}
      </Box>

      {/* Footer actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.75,
          borderTop: "1px solid #F1F5F9",
          bgcolor: "#FAFBFC",
          mt: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Button
            size="small"
            startIcon={<AssessmentIcon sx={{ fontSize: 13 }} />}
            onClick={handleCreateTest}
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 12,
              fontWeight: 500,
              color: "#fff",
              bgcolor: "#1B4F8A",
              textTransform: "none",
              height: 30,
              px: 1.5,
              borderRadius: 1.5,
              "&:hover": { bgcolor: "#153D6B" },
            }}
          >
            Crear test
          </Button>
          {onEdit && (
            <Button
              size="small"
              startIcon={<EditIcon sx={{ fontSize: 12 }} />}
              onClick={(e) => { e.stopPropagation(); onEdit(evaluated); }}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 12,
                fontWeight: 400,
                color: "#475569",
                textTransform: "none",
                borderRadius: 1.5,
                height: 30,
                px: 1.5,
                "&:hover": { bgcolor: "#F1F5F9", color: "#0F172A" },
              }}
            >
              Editar
            </Button>
          )}
        </Box>
        <Button
          size="small"
          startIcon={<DeleteIcon sx={{ fontSize: 12 }} />}
          onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }}
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
            fontWeight: 400,
            color: "#DC2626",
            textTransform: "none",
            borderRadius: 1.5,
            height: 30,
            px: 1.5,
            "&:hover": { bgcolor: "#FEF2F2", color: "#B91C1C" },
          }}
        >
          Eliminar
        </Button>
      </Box>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar evaluado"
        message={`¿Estás seguro de que deseas eliminar la evaluación de ${evaluated.name}? Se perderán todos sus tests asociados.`}
        confirmLabel="Eliminar"
        severity="danger"
        onConfirm={() => { setConfirmOpen(false); onDelete(evaluated.id); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

const StatCol = ({ icon, label, value, valueColor = "#0F172A" }) => (
  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {icon}
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 10,
          fontWeight: 500,
          color: "#94A3B8",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </Typography>
    </Box>
    <Typography
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 13,
        fontWeight: 700,
        color: valueColor,
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default EvaluatedCard;
