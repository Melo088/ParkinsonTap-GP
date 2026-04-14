import { authService } from "./authService";

export const readingService = {
  async fetchGraphData(testId) {
    if (!testId) {
      console.warn("fetchGraphData: testId es nulo o indefinido");
      return [];
    }

    try {
      const response = await authService.fetchWithAuth(`/graph/${testId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Test no encontrado');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // verificar que los datos tengan la estructura esperada
      if (!Array.isArray(data)) {
        console.warn("Los datos recibidos no son un array:", data);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Error al obtener datos del gráfico:", error);
      throw error; // se re-lanza el error para que el componente pueda manejarlo
    }
  }
};