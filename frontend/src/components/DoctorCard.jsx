import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  EmailOutlined as EmailIcon,
  MedicalServicesOutlined as SpecialityIcon,
  BusinessOutlined as CenterIcon,
  BadgeOutlined as BadgeIcon,
} from "@mui/icons-material";
import ConfirmDialog from "./ConfirmDialog";

const DoctorCard = ({ doctor, onDelete, onEdit }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const initials =
    `${doctor.firstName?.[0] ?? ""}${doctor.lastName?.[0] ?? ""}`.toUpperCase();

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(doctor.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid #E8EEF6",
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.05)",
          transition: "box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.06), 0 16px 32px rgba(27,79,138,0.10)",
            transform: "translateY(-2px)",
            borderColor: "#C7D9F0",
          },
        }}
      >
        {/* Header section */}
        <Box sx={{ px: 3, pt: 3, pb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            {/* Avatar */}
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                background: "linear-gradient(135deg, #1B4F8A 0%, #2563EB 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(27,79,138,0.25)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "0.01em",
                }}
              >
                {initials}
              </Typography>
            </Box>

            {/* Name + badge */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
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
                Dr. {doctor.firstName} {doctor.lastName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 12,
                  color: "#64748B",
                  mt: 0.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {doctor.speciality || "Sin especialidad"}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1.25,
                    py: 0.3,
                    bgcolor: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#1D4ED8",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {doctor.roleName || "Doctor"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ mx: 3, height: "1px", bgcolor: "#F1F5F9" }} />

        {/* Info rows */}
        <Box sx={{ px: 3, py: 2.5, display: "flex", flexDirection: "column", gap: 1.75, flex: 1 }}>
          {/* Email */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
            <EmailIcon sx={{ fontSize: 15, color: "#94A3B8", flexShrink: 0 }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                color: "#334155",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {doctor.email}
            </Typography>
            <Tooltip title={copied ? "Copiado" : "Copiar email"} placement="top">
              <IconButton
                size="small"
                onClick={handleCopyEmail}
                sx={{
                  p: 0.25,
                  color: copied ? "#059669" : "#94A3B8",
                  "&:hover": { color: copied ? "#059669" : "#475569", bgcolor: "#F8FAFC" },
                  transition: "color 0.15s ease",
                  flexShrink: 0,
                }}
              >
                {copied ? (
                  <CheckIcon sx={{ fontSize: 13 }} />
                ) : (
                  <CopyIcon sx={{ fontSize: 13 }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Medical center */}
          <InfoRow icon={<CenterIcon sx={{ fontSize: 15, color: "#94A3B8" }} />} value={doctor.medicalCenter || "—"} />
        </Box>

        {/* Divider */}
        <Box sx={{ mx: 3, height: "1px", bgcolor: "#F1F5F9" }} />

        {/* Footer actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 1.75,
            bgcolor: "#FAFBFC",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Button
              size="small"
              onClick={() => setProfileOpen(true)}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 12,
                fontWeight: 500,
                color: "#1B4F8A",
                border: "1px solid #BFDBFE",
                bgcolor: "#EFF6FF",
                textTransform: "none",
                borderRadius: 1.5,
                height: 30,
                px: 1.5,
                "&:hover": { bgcolor: "#DBEAFE", borderColor: "#93C5FD" },
              }}
            >
              Ver perfil
            </Button>
            {onEdit && (
              <Button
                size="small"
                startIcon={<EditIcon sx={{ fontSize: 12 }} />}
                onClick={() => onEdit(doctor)}
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
            onClick={() => setConfirmOpen(true)}
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
      </Box>

      {/* Profile modal */}
      <Dialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              pt: 3,
              pb: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 16,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Perfil del doctor
            </Typography>
            <IconButton
              size="small"
              onClick={() => setProfileOpen(false)}
              sx={{ color: "#94A3B8", "&:hover": { bgcolor: "#F1F5F9" } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 3, pt: 0 }}>
          {/* Avatar + name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2.5,
                background: "linear-gradient(135deg, #1B4F8A 0%, #2563EB 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(27,79,138,0.30)",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {initials}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0F172A",
                  lineHeight: 1.3,
                }}
              >
                Dr. {doctor.firstName} {doctor.lastName}
              </Typography>
              <Box sx={{ mt: 0.75 }}>
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    px: 1.25,
                    py: 0.3,
                    bgcolor: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#1D4ED8",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {doctor.roleName || "Doctor"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 2.5, borderColor: "#F1F5F9" }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <ProfileRow icon={<EmailIcon sx={{ fontSize: 15, color: "#94A3B8" }} />} label="Correo" value={doctor.email} />
            <ProfileRow icon={<SpecialityIcon sx={{ fontSize: 15, color: "#94A3B8" }} />} label="Especialidad" value={doctor.speciality || "—"} />
            <ProfileRow icon={<CenterIcon sx={{ fontSize: 15, color: "#94A3B8" }} />} label="Centro médico" value={doctor.medicalCenter || "—"} />
            <ProfileRow icon={<BadgeIcon sx={{ fontSize: 15, color: "#94A3B8" }} />} label="ID del sistema" value={`#${doctor.id}`} />
          </Box>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar doctor"
        message={`¿Estás seguro de que deseas eliminar al Dr. ${doctor.firstName} ${doctor.lastName}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        severity="danger"
        onConfirm={() => { setConfirmOpen(false); onDelete(doctor.id); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

const InfoRow = ({ icon, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
    {icon}
    <Typography
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 13,
        color: "#334155",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const ProfileRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
    <Box sx={{ mt: 0.15, flexShrink: 0 }}>{icon}</Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 11,
          fontWeight: 500,
          color: "#94A3B8",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          mb: 0.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 13,
          color: "#0F172A",
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

export default DoctorCard;
