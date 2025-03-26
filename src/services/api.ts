
// This is a simulated API service for the MVP
// In a real application, this would connect to your MongoDB backend

// Types
interface Campaign {
  id: string;
  title: string;
  description: string;
  reward: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdBy: string;
}

interface Referral {
  id: string;
  campaignId: string;
  referrerId: string;
  code: string;
  clicks: number;
  conversions: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isReferred: boolean;
  referredBy?: string;
}

interface Task {
  id: string;
  campaignId: string;
  description: string;
  completed: boolean;
  userId: string;
}

// Simulated database
let campaigns: Campaign[] = [
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

let referrals: Referral[] = [
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

// API methods
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Campaigns
  getCampaigns: async (): Promise<Campaign[]> => {
    await delay(500); // Simulate network delay
    return [...campaigns];
  },

  getCampaign: async (id: string): Promise<Campaign | null> => {
    await delay(300);
    const campaign = campaigns.find((c) => c.id === id);
    return campaign || null;
  },

  createCampaign: async (campaign: Omit<Campaign, "id">): Promise<Campaign> => {
    await delay(600);
    const newCampaign = {
      ...campaign,
      id: "camp-" + Math.random().toString(36).substr(2, 9),
    };
    campaigns.push(newCampaign);
    return newCampaign;
  },

  // Referrals
  getReferrals: async (campaignId?: string): Promise<Referral[]> => {
    await delay(400);
    return campaignId
      ? referrals.filter((r) => r.campaignId === campaignId)
      : [...referrals];
  },

  getReferral: async (code: string): Promise<Referral | null> => {
    await delay(300);
    const referral = referrals.find((r) => r.code === code);
    return referral || null;
  },

  createReferral: async (referral: Omit<Referral, "id" | "clicks" | "conversions" | "createdAt">): Promise<Referral> => {
    await delay(500);
    const newReferral = {
      ...referral,
      id: "ref-" + Math.random().toString(36).substr(2, 9),
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
    };
    referrals.push(newReferral);
    return newReferral;
  },

  trackReferralClick: async (code: string): Promise<void> => {
    await delay(200);
    const referral = referrals.find((r) => r.code === code);
    if (referral) {
      referral.clicks += 1;
    }
  },

  trackReferralConversion: async (code: string): Promise<void> => {
    await delay(300);
    const referral = referrals.find((r) => r.code === code);
    if (referral) {
      referral.conversions += 1;
    }
  },

  // Analytics 
  getAnalytics: async (campaignId?: string): Promise<{
    totalClicks: number;
    totalConversions: number;
    conversionRate: number;
  }> => {
    await delay(600);
    
    const filteredReferrals = campaignId 
      ? referrals.filter(r => r.campaignId === campaignId)
      : referrals;
    
    const totalClicks = filteredReferrals.reduce((sum, r) => sum + r.clicks, 0);
    const totalConversions = filteredReferrals.reduce((sum, r) => sum + r.conversions, 0);
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    
    return {
      totalClicks,
      totalConversions,
      conversionRate
    };
  }
};
