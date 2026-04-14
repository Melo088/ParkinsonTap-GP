import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authService } from "../services/authService";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authService.login(
        formData.email,
        formData.password,
      );
      authService.setToken(response.accessToken);
      const userRole = authService.getUserRole();
      if (userRole === "ADMIN") navigate("/admin");
      else if (userRole === "DOCTOR") navigate("/doctor");
      else navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        bgcolor: "#F7F6F3",
      }}
    >
      {/* Left panel — brand */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "#0D1117",
          p: 6,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "#4ECBA0",
              }}
            />
            <Typography
              sx={{
                color: "#fff",
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 500,
                fontSize: 15,
                letterSpacing: "0.01em",
              }}
            >
              Parkinson Tap
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography
            sx={{
              color: "#fff",
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 300,
              fontSize: { md: 36, lg: 44 },
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            Evaluación clínica
            <br />
            <Box component="span" sx={{ color: "#4ECBA0" }}>
              basada en datos.
            </Box>
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14,
              fontWeight: 300,
              maxWidth: 320,
              lineHeight: 1.7,
            }}
          >
            Sistema de monitoreo y análisis de movimiento para el seguimiento de
            pacientes con Parkinson.
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.2)",
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
          }}
        >
          © {new Date().getFullYear()} Parkinson Tap System
        </Typography>
      </Box>

      {/* Right panel — form */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          {/* Mobile logo */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1,
              mb: 6,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#4ECBA0",
              }}
            />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Parkinson Tap
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 26,
              fontWeight: 500,
              color: "#0D1117",
              mb: 1,
            }}
          >
            Iniciar sesión
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14,
              color: "#6B7280",
              fontWeight: 300,
              mb: 5,
            }}
          >
            Ingresa tus credenciales para continuar
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 1.5,
                fontSize: 13,
                fontFamily: '"DM Sans", sans-serif',
                bgcolor: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#B91C1C",
                "& .MuiAlert-icon": { color: "#B91C1C" },
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <Box>
              <Typography sx={labelStyle}>Correo electrónico</Typography>
              <TextField
                name="email"
                type="text"
                autoComplete="username"
                autoFocus
                required
                fullWidth
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="doctor@hospital.com"
                sx={inputStyle}
              />
            </Box>

            <Box>
              <Typography sx={labelStyle}>Contraseña</Typography>
              <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                fullWidth
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="••••••••"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                        size="small"
                        sx={{ color: "#9CA3AF" }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={inputStyle}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                mt: 1,
                height: 48,
                bgcolor: "#0D1117",
                color: "#fff",
                borderRadius: 1.5,
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 500,
                fontSize: 14,
                textTransform: "none",
                letterSpacing: "0.01em",
                "&:hover": { bgcolor: "#1a2332" },
                "&:disabled": { bgcolor: "#D1D5DB", color: "#9CA3AF" },
                transition: "background-color 0.2s ease",
              }}
            >
              {loading ? (
                <CircularProgress size={18} sx={{ color: "#9CA3AF" }} />
              ) : (
                "Continuar"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const labelStyle = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: 13,
  fontWeight: 500,
  color: "#374151",
  mb: 0.75,
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontFamily: '"DM Sans", sans-serif',
    fontSize: 14,
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#E5E7EB", borderWidth: 1 },
    "&:hover fieldset": { borderColor: "#9CA3AF" },
    "&.Mui-focused fieldset": { borderColor: "#0D1117", borderWidth: 1.5 },
  },
  "& input": { py: 1.5, px: 1.75, color: "#0D1117" },
  "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
};

export default LoginScreen;
