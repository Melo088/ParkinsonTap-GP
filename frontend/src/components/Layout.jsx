import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  KeyboardArrowDown,
  ExitToApp,
  AdminPanelSettings,
  LocalHospital,
} from "@mui/icons-material";
import { authService } from "../services/authService";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  const isLoginPage = location.pathname === "/login";

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
    handleClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const roleLabel = userRole === "ADMIN" ? "Administrador" : "Doctor";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F6F3",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top nav */}
      {!isLoginPage && (
        <Box
          component="header"
          sx={{
            height: 56,
            bgcolor: "#fff",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            px: { xs: 3, md: 5 },
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
            }}
            onClick={() =>
              navigate(userRole === "ADMIN" ? "/admin" : "/doctor")
            }
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
                fontWeight: 600,
                fontSize: 14,
                color: "#0D1117",
                letterSpacing: "0.01em",
              }}
            >
              Parkinson Tap
            </Typography>
          </Box>

          {/* User menu */}
          {isAuthenticated ? (
            <Box>
              <Box
                onClick={handleMenu}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 1.5,
                  border: "1px solid #E5E7EB",
                  bgcolor: "#fff",
                  "&:hover": { bgcolor: "#F9FAFB" },
                  transition: "background-color 0.15s ease",
                }}
              >
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    bgcolor: "#0D1117",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#4ECBA0",
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    {roleLabel[0]}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#374151",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  {roleLabel}
                </Typography>
                <KeyboardArrowDown sx={{ fontSize: 16, color: "#9CA3AF" }} />
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  sx: {
                    mt: 0.5,
                    borderRadius: 2,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    minWidth: 180,
                    "& .MuiList-root": { py: 0.75 },
                  },
                }}
              >
                {userRole === "ADMIN" && (
                  <MenuItem
                    onClick={() => handleNavigation("/admin")}
                    sx={menuItemStyle}
                  >
                    <AdminPanelSettings
                      sx={{ fontSize: 16, color: "#6B7280" }}
                    />
                    Panel Admin
                  </MenuItem>
                )}
                {userRole === "DOCTOR" && (
                  <MenuItem
                    onClick={() => handleNavigation("/doctor")}
                    sx={menuItemStyle}
                  >
                    <LocalHospital sx={{ fontSize: 16, color: "#6B7280" }} />
                    Panel Doctor
                  </MenuItem>
                )}
                <Divider sx={{ my: 0.5, borderColor: "#F3F4F6" }} />
                <MenuItem
                  onClick={handleLogout}
                  sx={{ ...menuItemStyle, color: "#EF4444" }}
                >
                  <ExitToApp sx={{ fontSize: 16, color: "#EF4444" }} />
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box
              onClick={() => navigate("/login")}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                fontWeight: 500,
                color: "#374151",
                cursor: "pointer",
                "&:hover": { color: "#0D1117" },
              }}
            >
              Iniciar sesión
            </Box>
          )}
        </Box>
      )}

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

const menuItemStyle = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: 13,
  fontWeight: 400,
  color: "#374151",
  gap: 1.5,
  px: 2,
  py: 1,
  mx: 0.5,
  borderRadius: 1,
  "&:hover": { bgcolor: "#F9FAFB" },
};

export default Layout;
