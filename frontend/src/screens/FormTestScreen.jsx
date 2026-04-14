import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import FormTest from "../components/FormTest";
import { evaluatedService } from "../services/testService";

const FormTestScreen = () => {
  const [evaluados, setEvaluados] = useState([]);
  const [selectedEvaluado, setSelectedEvaluado] = useState("");
  const [testName, setTestName] = useState("");
  const [side, setSide] = useState("");
  const [message, setMessage] = useState("");
  const [formTouched, setFormTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate();
  const { evaluatedId } = useParams();

  // Cargar evaluados y preseleccionar si viene por URL
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
            setTestName(
              `Test - ${evaluatedExists.nombre || evaluatedExists.name}`,
            );
          }
        }
      } catch (error) {
        console.error("Error fetching evaluated data:", error);
        setResponseMessage("Error al cargar los evaluados");
      }
    };
    fetchData();
  }, [evaluatedId]);

  // Tu función para sacar el email del JWT
  function getUserEmailFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub; // El 'sub' suele ser el email en el token
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched(true);

    if (!testName.trim() || !side || !message.trim() || !selectedEvaluado) {
      setResponseMessage("Por favor complete todos los campos obligatorios");
      return;
    }

    const testData = {
      doctorEmail: getUserEmailFromToken(),
      name: testName, // Coincide con 'private String name'
      description: message, // Coincide con 'private String description'
      evalAxis: side === "izquierdo", // Convierte el lado a Boolean para 'evalAxis'
      dateTime: new Date().toISOString().replace("Z", ""), // Formato LocalDateTime
      evaluatedId: parseInt(selectedEvaluado), // El ID plano que espera el Controller
    };

    setLoading(true);
    setResponseMessage("");

    try {
      console.log("Enviando testData:", testData);
      const result = await evaluatedService.saveTest(testData);

      if (result.error) {
        setResponseMessage(`Error: ${result.error}`);
      } else {
        setResponseMessage("Test guardado con éxito");
        // Si el backend devuelve el ID del nuevo test, vamos a adquisición
        const newId = result.id || result.testId;
        if (newId) {
          setTimeout(() => navigate(`/acquisition/${newId}`), 1500);
        } else {
          setTimeout(() => navigate("/tests"), 1500);
        }
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
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
        responseMessage={responseMessage}
      />
    </Box>
  );
};

export default FormTestScreen;
