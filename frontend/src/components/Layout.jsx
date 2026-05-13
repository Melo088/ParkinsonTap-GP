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
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  MonitorHeart as MonitorHeartIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { authService } from "../services/authService";

const SIDEBAR_WIDTH = 220;

const DOCTOR_NAV = [
  { label: "Evaluados", icon: PeopleIcon, path: "/doctor" },
  { label: "Tests", icon: AssignmentIcon, path: "/tests" },
  { label: "Nuevo test", icon: AddCircleOutlineIcon, path: "/form" },
];

const ADMIN_NAV = [
  { label: "Doctores", icon: AdminPanelSettingsIcon, path: "/admin" },
];

const PROFILE_NAV = { label: "Mi perfil", icon: AccountCircleIcon, path: "/profile" };

const PAGE_LABELS = {
  "/doctor": "Evaluados",
  "/tests": "Tests",
  "/form": "Nuevo test",
  "/admin": "Doctores",
  "/home": "Inicio",
  "/profile": "Mi perfil",
};

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  const userEmail = authService.getCurrentUserEmail();
  const userInitial = userEmail ? userEmail[0].toUpperCase() : (userRole === "ADMIN" ? "A" : "D");
  const userDisplayName = userEmail ? userEmail.split("@")[0] : (userRole === "ADMIN" ? "Administrador" : "Doctor");

  const baseNavItems = userRole === "ADMIN" ? ADMIN_NAV : DOCTOR_NAV;
  const navItems = [...baseNavItems, PROFILE_NAV];

  const currentPageLabel =
    PAGE_LABELS[location.pathname] ??
    (location.pathname.startsWith("/grafica")     ? "Análisis de datos"     :
     location.pathname.startsWith("/informe")     ? "Informe de Evaluación" :
     location.pathname.startsWith("/acquisition") ? "Adquisición de datos"  :
     location.pathname.startsWith("/test/")       ? "Nuevo test"            : "");

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
    handleClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F0F4F8", display: "flex", flexDirection: "column" }}>
      {/* ── Header ── */}
      <Box
        component="header"
        sx={{
          height: 64,
          bgcolor: "#fff",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 3 },
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 200,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", minWidth: 0 }}
          onClick={() => navigate(userRole === "ADMIN" ? "/admin" : "/doctor")}
        >
          <MonitorHeartIcon sx={{ fontSize: 22, color: "#1B4F8A" }} />
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: 14,
              color: "#111827",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            Parkinson Tap
          </Typography>

          {currentPageLabel && (
            <>
              <Box sx={{ width: 1, height: 16, bgcolor: "#E2E8F0", mx: 0.5 }} />
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 13,
                  color: "#4B5563",
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentPageLabel}
              </Typography>
            </>
          )}
        </Box>

        {/* User menu */}
        {isAuthenticated && (
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
                border: "1px solid #E2E8F0",
                bgcolor: "#fff",
                "&:hover": { bgcolor: "#F0F4F8" },
                transition: "background-color 0.15s ease",
              }}
            >
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  bgcolor: "#EBF2FB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#1B4F8A",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: '"DM Sans", sans-serif',
                  }}
                >
                  {userInitial}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#374151",
                  display: { xs: "none", sm: "block" },
                  maxWidth: 160,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userDisplayName}
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
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  minWidth: 200,
                  "& .MuiList-root": { py: 0.75 },
                },
              }}
            >
              {/* Email display */}
              <Box sx={{ px: 2, py: 1.25, borderBottom: "1px solid #F3F4F6", mb: 0.5 }}>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 500, color: "#374151" }}>
                  {userDisplayName}
                </Typography>
                {userEmail && (
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#9CA3AF", mt: 0.25 }}>
                    {userEmail}
                  </Typography>
                )}
              </Box>
              <MenuItem onClick={handleProfile} sx={menuItemStyle}>
                <AccountCircleIcon sx={{ fontSize: 16, color: "#6B7280" }} />
                Mi perfil
              </MenuItem>
              <Divider sx={{ my: 0.5, borderColor: "#F3F4F6" }} />
              <MenuItem
                onClick={handleLogout}
                sx={{ ...menuItemStyle, color: "#DC2626" }}
              >
                <ExitToApp sx={{ fontSize: 16, color: "#DC2626" }} />
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>

      {/* ── Body: sidebar + content ── */}
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "clip" }}>
        {/* Sidebar */}
        {isAuthenticated && (
          <Box
            component="nav"
            sx={{
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              bgcolor: "#fff",
              borderRight: "1px solid #E2E8F0",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              pt: 2,
              pb: 3,
              position: "sticky",
              top: 64,
              height: "calc(100vh - 64px)",
              overflowY: "auto",
            }}
          >
            {navItems.map(({ label, icon: Icon, path }, index) => {
              const isActive = location.pathname === path ||
                (path === "/form" && location.pathname.startsWith("/test/"));
              const isProfileItem = path === "/profile";
              return (
                <React.Fragment key={path}>
                  {isProfileItem && (
                    <Box sx={{ mx: 1.5, my: 1, height: "1px", bgcolor: "#F3F4F6" }} />
                  )}
                  <Box
                    onClick={() => navigate(path)}
                    sx={{
                      mx: 1.5,
                      mb: 0.5,
                      px: 1.5,
                      py: 1,
                      borderRadius: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      cursor: "pointer",
                      position: "relative",
                      bgcolor: isActive ? "#EBF2FB" : "transparent",
                      transition: "background-color 0.15s ease",
                      "&:hover": { bgcolor: isActive ? "#EBF2FB" : "#F0F4F8" },
                      ...(isActive && {
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: -6,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 3,
                          height: 20,
                          borderRadius: 2,
                          bgcolor: "#1B4F8A",
                        },
                      }),
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 18,
                        color: isActive ? "#1B4F8A" : "#6B7280",
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#1B4F8A" : "#4B5563",
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                </React.Fragment>
              );
            })}
          </Box>
        )}

        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, minWidth: 0, overflow: "auto" }}>
          <Outlet />
        </Box>
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
  "&:hover": { bgcolor: "#F0F4F8" },
};

export default Layout;
