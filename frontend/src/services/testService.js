import { authService } from "./authService";

export const evaluatedService = {
  // Obtener todos los evaluados
  getAllEvaluated: async () => {
    try {
      const response = await authService.fetchWithAuth('/evaluated/data', {
        method: 'GET'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener evaluados');
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching evaluated data:", error);
      return [];
    }
  },

  // Buscar evaluado por nombre
  searchByName: async (name) => {
    try {
      const response = await authService.fetchWithAuth(`/evaluated/search?name=${name}`, {
        method: 'GET'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al buscar evaluado');
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching evaluated data by name:", error);
      return [];
    }
  },

  // Guardar un test
  saveTest: async (testData) => {
    try {
      const response = await authService.fetchWithAuth('/test/save', {
        method: 'POST',
        body: JSON.stringify(testData),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al guardar el test');
      }
      return await response.json();
    } catch (error) {
      console.error("Error al guardar test:", error);
      return { error: error.message };
    }
  },

  // Borrar un test
  deleteTest: async (testId) => {
    try {
      const response = await authService.fetchWithAuth(`/test/delete/${testId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al eliminar el test');
      }
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar test:", error);
      throw error; // Re-lanzar el error para que sea manejado en el componente
    }
  },

  // Eliminar datos de un test 
  deleteTestData: async (testId) => {
    try {
      const response = await authService.fetchWithAuth(`/graph/readings/test/${testId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar los datos del test');
      }
      return await response.json();
    } catch (error) {
      console.error("Error al eliminar datos del test:", error);
      throw error; // Re-lanzar el error para que sea manejado en el componente
    }
  },

  // Obtener todos los tests 
  getAllTests: async () => {
    try {
      const response = await authService.fetchWithAuth('/test/all', {
        method: 'GET'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener tests');
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching all tests:", error.message);
      return [];
    }
  },

  // Obtener un test por ID
  getTestById: async (testId) => {
    try {
      const response = await authService.fetchWithAuth(`/test/${testId}`, {
        method: 'GET'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener el test');
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching test by ID:", error);
      return null;
    }
  },

  // Verificar si un test tiene datos
  hasData: async (testId) => {
    try {
      const response = await authService.fetchWithAuth(`/test/hasData/${testId}`, {
        method: 'GET'
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al verificar datos del test');
      }
    
      const data = await response.json();
      return data.hasData;
    } catch (error) {
      console.error("Error checking test data:", error);
      return false;
    }
  }
};