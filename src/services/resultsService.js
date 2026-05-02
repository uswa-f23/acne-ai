import api from './api';

const resultsService = {
  getResult: async (resultId) => {
    const response = await api.get(`/results/${resultId}`);
    return response.data;
  },

  getHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/results/history`, {
      params: { page, limit },
    });
    return response.data;
  },
};

export default resultsService;