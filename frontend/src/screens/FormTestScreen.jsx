import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import FormTest from "../components/FormTest";
import { evaluatedService } from "../services/testService";
import { useSnackbar } from "../context/SnackbarContext";

const FormTestScreen = () => {
  const [evaluados, setEvaluados] = useState([]);
  const [selectedEvaluado, setSelectedEvaluado] = useState("");
  const [testName, setTestName] = useState("");
  const [side, setSide] = useState("");
  const [message, setMessage] = useState("");
  const [formTouched, setFormTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { evaluatedId } = useParams();
  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await evaluatedService.getAllEvaluated();
        setEvaluados(data);

        if (evaluatedId) {
          const evaluatedExists = data.find(
            (ev) => (ev.id || ev.idEvaluado).toString() === evaluatedId,
          );
          if (evaluatedExists) {
            setSelectedEvaluado(evaluatedId);
            setTestName(`Test - ${evaluatedExists.nombre || evaluatedExists.name}`);
          }
        }
      } catch (error) {
        console.error("Error fetching evaluated data:", error);
        showError("Error al cargar los evaluados");
      }
    };
    fetchData();
  }, [evaluatedId]);

  function getUserEmailFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched(true);

    if (!testName.trim() || !side || !message.trim() || !selectedEvaluado) {
      showError("Por favor complete todos los campos obligatorios");
      return;
    }

    const testData = {
      doctorEmail: getUserEmailFromToken(),
      name: testName,
      description: message,
      evalAxis: side === "izquierdo",
      dateTime: new Date().toISOString().replace("Z", ""),
      evaluatedId: parseInt(selectedEvaluado),
    };

    setLoading(true);

    try {
      const result = await evaluatedService.saveTest(testData);

      if (result.error) {
        showError(`Error: ${result.error}`);
      } else {
        showSuccess("Test guardado con éxito");
        const newId = result.id || result.testId;
        if (newId) {
          setTimeout(() => navigate(`/acquisition/${newId}`), 1500);
        } else {
          setTimeout(() => navigate("/tests"), 1500);
        }
      }
    } catch (error) {
      showError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <FormTest
        testName={testName}
        setTestName={setTestName}
        side={side}
        setSide={setSide}
        message={message}
        setMessage={setMessage}
        selectedEvaluado={selectedEvaluado}
        setSelectedEvaluado={setSelectedEvaluado}
        evaluados={evaluados}
        formTouched={formTouched}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </Box>
  );
};

export default FormTestScreen;
