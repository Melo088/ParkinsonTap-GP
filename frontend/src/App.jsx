import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
// Screens
import HomeScreen from "./screens/HomeScreen";
import FormTestScreen from "./screens/FormTestScreen";
import DataAcquisitionScreen from "./screens/DataAcquisitionScreen";
import LoginScreen from "./screens/LoginScreen";
import AdminScreen from "./screens/AdminScreen";
import UnauthorizedScreen from "./screens/UnauthorizedScreen";
import EvaluatedScreen from "./screens/EvaluatedScreen";
import GraphScreen from "./screens/GraphScreen";
import TestsScreen from "./screens/TestsScreen";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
// Services
import { authService } from "./services/authService";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
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
      <BrowserRouter>
        <Routes>
          {/* 1. Rutas públicas (Sin barra) */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/unauthorized" element={<UnauthorizedScreen />} />

          {/* 2. Rutas protegidas (Base) */}
          <Route path="/" element={<ProtectedRoute />}>
            {/* 3. TODO LO QUE LLEVA BARRA (Layout) */}
            <Route element={<Layout />}>
              {/* Redirección inicial */}
              <Route index element={<RoleBasedRedirect />} />

              {/* Home */}
              <Route path="home" element={<HomeScreen />} />

              {/* Panel ADMIN - Ahora DENTRO del Layout */}
              <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                <Route path="admin" element={<AdminScreen />} />
              </Route>

              {/* Panel DOCTOR y sus herramientas - Ahora DENTRO del Layout */}
              <Route element={<ProtectedRoute requiredRole="DOCTOR" />}>
                <Route path="doctor" element={<EvaluatedScreen />} />
                <Route path="tests" element={<TestsScreen />} />
                <Route path="grafica/:testId" element={<GraphScreen />} />
                <Route path="form" element={<FormTestScreen />} />
                <Route path="test/:evaluatedId" element={<FormTestScreen />} />
                <Route
                  path="acquisition/:testId"
                  element={<DataAcquisitionScreen />}
                />
              </Route>
            </Route>{" "}
            {/* Cierre de Layout */}
          </Route>

          {/* Ruta comodín */}
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
    </ThemeProvider>
  );
}

export default App;
