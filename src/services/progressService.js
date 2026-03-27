import api from './api';

const progressService = {
  // Get progress summary
  getSummary: async (days = 30) => {
    const response = await api.get('/progress/summary', {
      params: { days },
    });
    return response.data;
  },

  // Compare two results
  compare: async (resultIdA, resultIdB) => {
    const response = await api.get('/progress/compare', {
      params: { result_id_a: resultIdA, result_id_b: resultIdB },
    });
    return response.data;
  },
};

export default progressService;