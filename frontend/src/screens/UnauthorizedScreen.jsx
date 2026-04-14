import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const UnauthorizedScreen = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    const userRole = authService.getUserRole();
    if (userRole === "ADMIN") navigate("/admin");
    else if (userRole === "DOCTOR") navigate("/doctor");
    else navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F6F3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        {/* Error code */}
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 96,
            fontWeight: 700,
            color: "#E5E7EB",
            lineHeight: 1,
            mb: 2,
            letterSpacing: "-0.04em",
          }}
        >
          401
        </Typography>

        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 22,
            fontWeight: 500,
            color: "#0D1117",
            mb: 1.5,
          }}
        >
          Acceso denegado
        </Typography>

        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14,
            color: "#6B7280",
            fontWeight: 300,
            lineHeight: 1.7,
            mb: 5,
          }}
        >
          No tienes los permisos necesarios para acceder a esta página. Contacta
          al administrador si crees que esto es un error.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            onClick={handleGoBack}
            sx={{
              height: 44,
              px: 3.5,
              bgcolor: "#0D1117",
              color: "#fff",
              borderRadius: 1.5,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 500,
              fontSize: 13,
              textTransform: "none",
              "&:hover": { bgcolor: "#1a2332" },
            }}
          >
            Volver al inicio
          </Button>
          <Button
            onClick={() => {
              authService.logout();
              navigate("/login");
            }}
            sx={{
              height: 44,
              px: 3.5,
              bgcolor: "transparent",
              color: "#6B7280",
              border: "1px solid #E5E7EB",
              borderRadius: 1.5,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 400,
              fontSize: 13,
              textTransform: "none",
              "&:hover": { bgcolor: "#F9FAFB", borderColor: "#D1D5DB" },
            }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UnauthorizedScreen;
