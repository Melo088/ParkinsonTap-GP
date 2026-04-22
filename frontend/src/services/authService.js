const API_BASE_URL = 'http://localhost:8080/api';
const getToken = () => localStorage.getItem('token');

// Encabezados comunes con token
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authService = {
  // Login
  login: async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      // Intentar leer el JSON del error
      let errorMessage = 'Usuario o contraseña incorrectos';
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        // Aquí capturamos el error de JSON.parse y solo lo mostramos en consola
        console.error('Error al parsear el mensaje de error JSON:', parseError);
      }
      throw new Error(errorMessage);
    }

    // Intentar parsear la respuesta JSON de forma segura
    try {
      const data = await response.json();
      return data;
    } catch (parseError) {
      console.error('Error al parsear la respuesta JSON:', parseError);
      throw new Error('Error en el servidor. Intente más tarde.');
    }

  } catch (error) {
    throw new Error(error.message || 'Error en el login');
  }
}
,

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = getToken();
    return !!token;
  },

  // Obtener el rol del usuario
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },

    getCurrentUserEmail: () => {
    const token = getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload) return null;
    return payload.sub || null;
  },

  // Verificar si el token ha expirado
  isTokenExpired: () => {
    const token = getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  // Guardar token y extraer información
  setToken: (token) => {
    localStorage.setItem('token', token);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.roles;
      localStorage.setItem('userRole', roles);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  },

  // Verificar si el usuario tiene un rol específico
  hasRole: (role) => {
    const userRole = localStorage.getItem('userRole');
    return userRole === role;
  },

  // Hacer una solicitud autenticada con fetch
  fetchWithAuth: async (url, options = {}) => {
    const headers = {
      ...options.headers,
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }

    return response;
  }
};
