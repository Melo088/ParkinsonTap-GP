import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
  Skeleton,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Lock as LockIcon,
  MonitorHeart as MonitorHeartIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { authService } from "../services/authService";
import { doctorService } from "../services/doctorService";
import { useSnackbar } from "../context/SnackbarContext";

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const { showSuccess, showError } = useSnackbar();
  const isDoctor = authService.getUserRole() === "DOCTOR";
  const userEmail = authService.getCurrentUserEmail();
  const userInitial = userEmail ? userEmail[0].toUpperCase() : "?";

  useEffect(() => {
    if (isDoctor) {
      doctorService
        .getMyProfile()
        .then((data) => {
          setProfile(data);
          setEditData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            speciality: data.speciality || "",
            medicalCenter: data.medicalCenter || "",
          });
        })
        .catch((err) => showError("Error al cargar el perfil: " + err.message))
        .finally(() => setLoading(false));
    } else {
      setProfile({ email: userEmail, roleName: "ADMIN", firstName: "", lastName: "" });
      setLoading(false);
    }
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editData.firstName.trim() || !editData.lastName.trim()) {
      showError("El nombre y apellido son obligatorios.");
      return;
    }
    setSaveLoading(true);
    try {
      const updated = await doctorService.updateMyProfile(editData);
      setProfile(updated);
      setEditing(false);
      showSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      showError("Error al actualizar: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      speciality: profile?.speciality || "",
      medicalCenter: profile?.medicalCenter || "",
    });
    setEditing(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
    setPasswordSuccess(false);
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError("Completa todos los campos.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setPasswordLoading(true);
    try {
      await doctorService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showSuccess("Contraseña cambiada correctamente.");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : isDoctor
      ? "Doctor"
      : "Administrador";

  if (loading) {
    return (
      <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F0F4F8", pb: 10 }}>
        <Container maxWidth="md" sx={{ pt: 6 }}>
          <Skeleton width={160} height={36} sx={{ mb: 5 }} />
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Skeleton variant="rounded" width={280} height={320} sx={{ borderRadius: 2.5, flexShrink: 0 }} />
            <Skeleton variant="rounded" sx={{ flex: 1, minWidth: 260, height: 320, borderRadius: 2.5 }} />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F0F4F8", pb: 10 }}>
      <Container maxWidth="md" sx={{ pt: 6 }}>
        {/* Page header */}
        <Typography
          sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 28, fontWeight: 600, color: "#111827", mb: 0.5 }}
        >
          Mi perfil
        </Typography>
        <Typography
          sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: "#4B5563", fontWeight: 300, mb: 5 }}
        >
          Información de tu cuenta en el sistema
        </Typography>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* Identity card */}
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 2.5,
              overflow: "hidden",
              width: { xs: "100%", sm: 280 },
              flexShrink: 0,
            }}
          >
            <Box sx={{ height: 3, bgcolor: isDoctor ? "#1B4F8A" : "#6B7280" }} />
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              {/* Avatar */}
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  bgcolor: isDoctor ? "#1B4F8A" : "#374151",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.02em",
                  }}
                >
                  {userInitial}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 17,
                  fontWeight: 600,
                  color: "#111827",
                  mb: 0.5,
                }}
              >
                {displayName}
              </Typography>

              {/* Role badge */}
              <Box
                sx={{
                  px: 1.5,
                  py: 0.4,
                  bgcolor: isDoctor ? "#EBF2FB" : "#F3F4F6",
                  border: `1px solid ${isDoctor ? "#BFDBFE" : "#E2E8F0"}`,
                  borderRadius: 1,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                {isDoctor ? (
                  <MonitorHeartIcon sx={{ fontSize: 13, color: "#1B4F8A" }} />
                ) : (
                  <AdminIcon sx={{ fontSize: 13, color: "#6B7280" }} />
                )}
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 11,
                    fontWeight: 600,
                    color: isDoctor ? "#1B4F8A" : "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {isDoctor ? "Doctor" : "Administrador"}
                </Typography>
              </Box>

              <Divider sx={{ width: "100%", borderColor: "#F3F4F6", mb: 2 }} />

              <Box sx={{ width: "100%", textAlign: "left" }}>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5 }}>
                  Correo electrónico
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#374151", wordBreak: "break-all" }}>
                  {profile?.email || userEmail}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Details + edit column */}
          <Box sx={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Info section */}
            <Box
              sx={{
                bgcolor: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 2.5,
                overflow: "hidden",
              }}
            >
              <Box sx={{ height: 3, bgcolor: isDoctor ? "#1B4F8A" : "#6B7280" }} />
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 16, color: "#6B7280" }} />
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 600, color: "#111827" }}>
                      Información personal
                    </Typography>
                  </Box>
                  {isDoctor && !editing && (
                    <Button
                      startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                      onClick={() => setEditing(true)}
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#1B4F8A",
                        textTransform: "none",
                        height: 32,
                        px: 1.5,
                        border: "1px solid #BFDBFE",
                        bgcolor: "#EBF2FB",
                        borderRadius: 1.5,
                        "&:hover": { bgcolor: "#DBEAFE" },
                      }}
                    >
                      Editar
                    </Button>
                  )}
                </Box>

                {!isDoctor ? (
                  /* Admin: read-only */
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <InfoRow label="Rol" value="Administrador del sistema" />
                    <InfoRow label="Email" value={profile?.email || userEmail} />
                  </Box>
                ) : editing ? (
                  /* Edit mode */
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                      <Box>
                        <Typography sx={labelStyle}>Nombre</Typography>
                        <TextField
                          name="firstName"
                          value={editData.firstName}
                          onChange={handleEditChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Box>
                      <Box>
                        <Typography sx={labelStyle}>Apellido</Typography>
                        <TextField
                          name="lastName"
                          value={editData.lastName}
                          onChange={handleEditChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Typography sx={labelStyle}>Especialidad</Typography>
                      <TextField
                        name="speciality"
                        value={editData.speciality}
                        onChange={handleEditChange}
                        fullWidth
                        size="small"
                        placeholder="Neurología, Medicina general…"
                        sx={inputStyle}
                      />
                    </Box>
                    <Box>
                      <Typography sx={labelStyle}>Centro médico</Typography>
                      <TextField
                        name="medicalCenter"
                        value={editData.medicalCenter}
                        onChange={handleEditChange}
                        fullWidth
                        size="small"
                        placeholder="Hospital, Clínica…"
                        sx={inputStyle}
                      />
                    </Box>
                    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", pt: 1 }}>
                      <Button
                        startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                        onClick={handleCancelEdit}
                        disabled={saveLoading}
                        sx={cancelBtnStyle}
                      >
                        Cancelar
                      </Button>
                      <Button
                        startIcon={saveLoading ? null : <SaveIcon sx={{ fontSize: 14 }} />}
                        onClick={handleSave}
                        disabled={saveLoading}
                        sx={saveBtnStyle}
                      >
                        {saveLoading ? <CircularProgress size={14} sx={{ color: "#9CA3AF" }} /> : "Guardar"}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  /* Read mode */
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <InfoRow label="Nombre" value={profile?.firstName || "—"} />
                    <InfoRow label="Apellido" value={profile?.lastName || "—"} />
                    <InfoRow label="Especialidad" value={profile?.speciality || "—"} />
                    <InfoRow label="Centro médico" value={profile?.medicalCenter || "—"} />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Security section */}
            <Box
              sx={{
                bgcolor: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 2.5,
                overflow: "hidden",
              }}
            >
              <Box sx={{ height: 3, bgcolor: "#6B7280" }} />
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: showPasswordForm ? 3 : 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LockIcon sx={{ fontSize: 16, color: "#6B7280" }} />
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 600, color: "#111827" }}>
                      Seguridad
                    </Typography>
                  </Box>
                  {!showPasswordForm && (
                    <Button
                      onClick={() => { setShowPasswordForm(true); setPasswordSuccess(false); }}
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#6B7280",
                        textTransform: "none",
                        height: 32,
                        px: 1.5,
                        border: "1px solid #E2E8F0",
                        borderRadius: 1.5,
                        "&:hover": { bgcolor: "#F0F4F8" },
                      }}
                    >
                      Cambiar contraseña
                    </Button>
                  )}
                </Box>

                {showPasswordForm && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {passwordError && (
                      <Box sx={{ p: 2, bgcolor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 1.5 }}>
                        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#B91C1C" }}>
                          {passwordError}
                        </Typography>
                      </Box>
                    )}
                    {passwordSuccess && (
                      <Box sx={{ p: 2, bgcolor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: "#059669" }} />
                        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#059669" }}>
                          Contraseña actualizada correctamente.
                        </Typography>
                      </Box>
                    )}
                    <Box>
                      <Typography sx={labelStyle}>Contraseña actual</Typography>
                      <TextField
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        fullWidth
                        size="small"
                        sx={inputStyle}
                      />
                    </Box>
                    <Box>
                      <Typography sx={labelStyle}>Nueva contraseña</Typography>
                      <TextField
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        fullWidth
                        size="small"
                        placeholder="Mínimo 6 caracteres"
                        sx={inputStyle}
                      />
                    </Box>
                    <Box>
                      <Typography sx={labelStyle}>Confirmar nueva contraseña</Typography>
                      <TextField
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        fullWidth
                        size="small"
                        sx={inputStyle}
                      />
                    </Box>
                    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", pt: 1 }}>
                      <Button
                        onClick={() => { setShowPasswordForm(false); setPasswordError(""); setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}
                        disabled={passwordLoading}
                        sx={cancelBtnStyle}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handlePasswordSubmit}
                        disabled={passwordLoading}
                        sx={saveBtnStyle}
                      >
                        {passwordLoading ? <CircularProgress size={14} sx={{ color: "#9CA3AF" }} /> : "Actualizar"}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 3 }}>
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
        textAlign: "right",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "70%",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const labelStyle = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: 12,
  fontWeight: 500,
  color: "#374151",
  mb: 0.75,
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontFamily: '"DM Sans", sans-serif',
    fontSize: 13,
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#E2E8F0", borderWidth: 1 },
    "&:hover fieldset": { borderColor: "#9CA3AF" },
    "&.Mui-focused fieldset": { borderColor: "#1B4F8A", borderWidth: 1.5 },
  },
  "& input": { color: "#111827" },
  "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
};

const cancelBtnStyle = {
  height: 36,
  px: 2,
  border: "1px solid #E2E8F0",
  color: "#6B7280",
  borderRadius: 1.5,
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 400,
  fontSize: 13,
  textTransform: "none",
  "&:hover": { bgcolor: "#F0F4F8" },
};

const saveBtnStyle = {
  height: 36,
  px: 2,
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

export default ProfileScreen;
