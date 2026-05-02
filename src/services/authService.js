import api from './api';

const authService = {
  // Register new user
  register: async (fullName, email, password) => {
    const response = await api.post('/auth/register', {
      full_name: fullName,
      email,
      password,
    });
    if (response.data.success) {
      const { access_token, refresh_token, user_id, email: userEmail } = response.data.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify({ id: user_id, email: userEmail, full_name: fullName }));
    }
    return response.data;
  },

  // Login existing user
  login: async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });

    if (response.data.success) {
      const { access_token, refresh_token } = response.data.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      try {
        const profileRes = await api.get('/auth/me');
        if (profileRes.data.success) {
          localStorage.setItem('user', JSON.stringify(profileRes.data.data));
        }
      } catch (err) {
        console.error('Profile fetch failed:', err);
      }
    }

    return response.data;

  } catch (error) {
    // 🔥 FORCE proper error structure
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    };
  }
},

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    // window.location.href = '/login';
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Get current user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  //Code for password reset, email verification
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  },
};

export default authService;