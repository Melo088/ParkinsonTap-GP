import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// Screens
import HomeScreen from "./screens/HomeScreen";
import FormTestScreen from "./screens/FormTestScreen";
import DataAcquisitionScreen from "./screens/DataAcquisitionScreen";
import LoginScreen from "./screens/LoginScreen";
import AdminScreen from "./screens/AdminScreen";
import UnauthorizedScreen from "./screens/UnauthorizedScreen";
import EvaluatedScreen from "./screens/EvaluatedScreen";
import GraphScreen from "./screens/GraphScreen";
import AnalysisScreen from "./screens/AnalysisScreen";
import TestsScreen from "./screens/TestsScreen";
import ProfileScreen from "./screens/ProfileScreen";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Context
import { SnackbarProvider } from "./context/SnackbarContext";

// Services
import { authService } from "./services/authService";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1B4F8A",
      dark: "#153D6B",
      light: "#EBF2FB",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#059669",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#059669",
    },
    error: {
      main: "#DC2626",
    },
    warning: {
      main: "#D97706",
    },
    background: {
      default: "#F0F4F8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
    },
    divider: "#E2E8F0",
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
          fontWeight: 500,
          fontFamily: '"DM Sans", sans-serif',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const RoleBasedRedirect = () => {
  const userRole = authService.getUserRole();
  if (userRole === "ADMIN") return <Navigate to="/admin" replace />;
  if (userRole === "DOCTOR") return <Navigate to="/doctor" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/unauthorized" element={<UnauthorizedScreen />} />

            {/* Rutas protegidas */}
            <Route path="/" element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<RoleBasedRedirect />} />
                <Route path="home" element={<HomeScreen />} />

                <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                  <Route path="admin" element={<AdminScreen />} />
                </Route>

                <Route path="profile" element={<ProfileScreen />} />

                <Route element={<ProtectedRoute requiredRole="DOCTOR" />}>
                  <Route path="doctor" element={<EvaluatedScreen />} />
                  <Route path="tests" element={<TestsScreen />} />
                  <Route path="grafica/:testId" element={<GraphScreen />} />
                  <Route path="form" element={<FormTestScreen />} />
                  <Route path="test/:evaluatedId" element={<FormTestScreen />} />
                  <Route path="acquisition/:testId" element={<DataAcquisitionScreen />} />
                  <Route path="informe/:testId" element={<AnalysisScreen />} />
                </Route>
              </Route>
            </Route>

            <Route
              path="*"
              element={
                authService.isAuthenticated() && !authService.isTokenExpired() ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
