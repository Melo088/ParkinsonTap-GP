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
        throw new Error(error.message || 'Error al obtener evaluados');
        }
    },
    
    // Registrar nuevo evaluado
    registerEvaluated: async (evaluatedData) => {
        try {
        const response = await authService.fetchWithAuth('/evaluated/register', {
            method: 'POST',
            body: JSON.stringify(evaluatedData)
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al registrar evaluado');
        }
    
        return await response.json();
        } catch (error) {
        throw new Error(error.message || 'Error al registrar evaluado');
        }
    },
    
    // Eliminar evaluado
    deleteEvaluated: async (evaluatedId) => {
        try {
        const response = await authService.fetchWithAuth(`/evaluated/delete/${evaluatedId}`, {
            method: 'DELETE'
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar evaluado');
        }
    
        return await response.json();
        } catch (error) {
        throw new Error(error.message || 'Error al eliminar evaluado');
        }
    }
};