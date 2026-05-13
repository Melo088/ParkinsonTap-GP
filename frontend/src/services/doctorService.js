import { authService } from './authService';

export const doctorService = {
  getAllDoctors: async () => {
    try {
      const response = await authService.fetchWithAuth('/doctor/all', { method: 'GET' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener doctores');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error al obtener doctores');
    }
  },

  registerDoctor: async (doctorData) => {
    try {
      const response = await authService.fetchWithAuth('/doctor/register', {
        method: 'POST',
        body: JSON.stringify(doctorData),
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

  updateDoctor: async (doctorId, data) => {
    try {
      const response = await authService.fetchWithAuth(`/doctor/update/${doctorId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar doctor');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar doctor');
    }
  },

  deleteDoctor: async (doctorId) => {
    try {
      const response = await authService.fetchWithAuth(`/doctor/delete/${doctorId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar doctor');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar doctor');
    }
  },

  getMyProfile: async () => {
    try {
      const response = await authService.fetchWithAuth('/doctor/me', { method: 'GET' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener perfil');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error al obtener perfil');
    }
  },

  updateMyProfile: async (data) => {
    try {
      const response = await authService.fetchWithAuth('/doctor/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar perfil');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar perfil');
    }
  },

  changePassword: async (data) => {
    try {
      const response = await authService.fetchWithAuth('/user/change-password', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar contraseña');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error al cambiar contraseña');
    }
  },
};
