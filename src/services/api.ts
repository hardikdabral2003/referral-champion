
import axios from 'axios';

// API base URL - Updated to use relative URL instead of localhost
const API_BASE_URL = '/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Types
interface Campaign {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  reward: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdBy: string;
}

interface Referral {
  id?: string;
  _id?: string;
  campaignId: string;
  referrerId: string;
  code: string;
  clicks: number;
  conversions: number;
  createdAt?: string;
}

interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  isReferred: boolean;
  referredBy?: string;
}

interface Task {
  id?: string;
  _id?: string;
  campaignId: string;
  description: string;
  completed: boolean;
  userId: string;
}

interface AnalyticsData {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Helper function to transform MongoDB _id to id
const transformResponse = (data: any) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      id: item._id
    }));
  } else if (data && typeof data === 'object') {
    return {
      ...data,
      id: data._id
    };
  }
  return data;
};

// Helper to set auth token for requests
const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const api = {
  // Auth
  register: async (userData: Omit<User, "id" | "isReferred">): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        setAuthToken(token);
      }
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        setAuthToken(token);
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  },

  // Initialize auth from stored token
  initAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      return token;
    }
    return null;
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get('/auth/me');
      return transformResponse(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  // Campaigns
  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      const response = await apiClient.get('/campaigns');
      return transformResponse(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // Fallback to mock data for development
      const mockCampaigns = [
        {
          id: "camp-1",
          title: "Summer Promotion",
          description: "Refer friends to get summer discounts",
          reward: "$10 off next purchase",
          startDate: "2023-06-01",
          endDate: "2023-08-31",
          active: true,
          createdBy: "user-123",
        },
        {
          id: "camp-2",
          title: "New User Bonus",
          description: "Refer new users to our platform",
          reward: "$5 credit for you and your friend",
          startDate: "2023-05-15",
          endDate: "2023-12-31",
          active: true,
          createdBy: "user-123",
        },
      ];
      return mockCampaigns;
    }
  },

  getCampaign: async (id: string): Promise<Campaign | null> => {
    try {
      const response = await apiClient.get(`/campaigns/${id}`);
      return transformResponse(response.data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return null;
    }
  },

  createCampaign: async (campaign: Omit<Campaign, "id">): Promise<Campaign> => {
    try {
      const response = await apiClient.post('/campaigns', campaign);
      return transformResponse(response.data);
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  // Referrals
  getReferrals: async (campaignId?: string): Promise<Referral[]> => {
    try {
      let url = '/referrals';
      if (campaignId) {
        url = `/referrals/campaign/${campaignId}`;
      }
      const response = await apiClient.get(url);
      return transformResponse(response.data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      // Fallback to mock data
      const mockReferrals = [
        {
          id: "ref-1",
          campaignId: "camp-1",
          referrerId: "user-123",
          code: "SUMMER10",
          clicks: 24,
          conversions: 5,
          createdAt: "2023-06-05",
        },
        {
          id: "ref-2",
          campaignId: "camp-2",
          referrerId: "user-123",
          code: "NEWUSER5",
          clicks: 12,
          conversions: 3,
          createdAt: "2023-05-20",
        },
      ];
      return campaignId
        ? mockReferrals.filter(r => r.campaignId === campaignId)
        : mockReferrals;
    }
  },

  getReferral: async (code: string): Promise<Referral | null> => {
    try {
      const response = await apiClient.get(`/referrals/code/${code}`);
      return transformResponse(response.data);
    } catch (error) {
      console.error('Error fetching referral:', error);
      return null;
    }
  },

  createReferral: async (referral: Omit<Referral, "id" | "clicks" | "conversions" | "createdAt">): Promise<Referral> => {
    try {
      const response = await apiClient.post('/referrals', referral);
      return transformResponse(response.data);
    } catch (error) {
      console.error('Error creating referral:', error);
      throw error;
    }
  },

  trackReferralClick: async (code: string): Promise<void> => {
    try {
      await apiClient.put(`/referrals/click/${code}`);
    } catch (error) {
      console.error('Error tracking referral click:', error);
      throw error;
    }
  },

  trackReferralConversion: async (code: string): Promise<void> => {
    try {
      await apiClient.put(`/referrals/convert/${code}`);
    } catch (error) {
      console.error('Error tracking referral conversion:', error);
      throw error;
    }
  },

  // Analytics
  getAnalytics: async (campaignId?: string): Promise<AnalyticsData> => {
    try {
      if (campaignId) {
        const referrals = await api.getReferrals(campaignId);
        
        const totalClicks = referrals.reduce((sum, r) => sum + r.clicks, 0);
        const totalConversions = referrals.reduce((sum, r) => sum + r.conversions, 0);
        const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
        
        return {
          totalClicks,
          totalConversions,
          conversionRate
        };
      } else {
        const response = await apiClient.get('/analytics');
        return response.data;
      }
    } catch (error) {
      console.error('Error calculating analytics:', error);
      return {
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0
      };
    }
  },

  // Users
  createUser: async (user: Omit<User, "id">): Promise<User> => {
    try {
      const response = await apiClient.post('/users', user);
      return transformResponse(response.data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Tasks
  createTask: async (task: Omit<Task, "id" | "completed">): Promise<Task> => {
    try {
      const response = await apiClient.post('/tasks', task);
      return transformResponse(response.data);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  completeTask: async (taskId: string): Promise<Task> => {
    try {
      const response = await apiClient.put(`/tasks/complete/${taskId}`);
      return transformResponse(response.data);
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }
};

// Initialize token on load
api.initAuth();
