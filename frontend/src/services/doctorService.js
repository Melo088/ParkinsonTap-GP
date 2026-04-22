import { authService } from './authService';

export const doctorService = {
  // Obtener todos los doctores
  getAllDoctors: async () => {
    try {
      const response = await authService.fetchWithAuth('/doctor/all', {
        method: 'GET'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener doctores');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error al obtener doctores');
    }
  },

  // Registrar nuevo doctor
  registerDoctor: async (doctorData) => {
    try {
      const response = await authService.fetchWithAuth('/doctor/register', {
        method: 'POST',
        body: JSON.stringify(doctorData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar doctor');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error al registrar doctor');
    }
  },

  // Eliminar doctor
  deleteDoctor: async (doctorId) => {
    try {
      const response = await authService.fetchWithAuth(`/doctor/delete/${doctorId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar doctor');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar doctor');
    }
  }
};
