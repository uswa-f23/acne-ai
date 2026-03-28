import api from './api';

const storiesService = {
  // Get all stories
  getStories: async () => {
    const response = await api.get('/stories/');
    return response.data;
  },

  // Submit a new story
  submitStory: async ({ username, story }) => {
    const response = await api.post('/stories/', { username, story });
    return response.data;
  },

  // Like a story
  likeStory: async (id) => {
    const response = await api.post(`/stories/${id}/like`);
    return response.data;
  },
};

export default storiesService;