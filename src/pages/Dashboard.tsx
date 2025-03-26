
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CampaignForm from "@/components/CampaignForm";
import ReferralLink from "@/components/ReferralLink";
import Analytics from "@/components/Analytics";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const campaignsData = await api.getCampaigns();
        setCampaigns(campaignsData);
        
        if (campaignsData.length > 0) {
          const campaignId = selectedCampaign || campaignsData[0].id;
          setSelectedCampaign(campaignId);
          
          const referralsData = await api.getReferrals(campaignId);
          setReferrals(referralsData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, selectedCampaign, refreshTrigger]);

  const handleCreateCampaign = (campaignId: string) => {
    setSelectedCampaign(campaignId);
    setActiveTab("campaigns");
    
    // Create a default referral for this campaign
    const createReferral = async () => {
      if (!user) return;
      
      try {
        const referralCode = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        await api.createReferral({
          campaignId,
          referrerId: user.id,
          code: referralCode,
        });
        
        // Refresh the data
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error("Error creating referral:", error);
      }
    };
    
    createReferral();
  };

  const handleCampaignSelect = (campaignId: string) => {
    setSelectedCampaign(campaignId);
  };

  if (!user) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[80vh]">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your referral dashboard.
          </p>
          <Button onClick={login} className="w-full">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your referral campaigns and track performance
          </p>
        </div>
        <Button 
          onClick={() => setActiveTab("new")} 
          className="mt-4 md:mt-0"
        >
          Create New Campaign
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="new">Create New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-8">
          {loading ? (
            <div className="space-y-4">
              <div className="h-24 bg-muted animate-pulse rounded-lg"></div>
              <div className="h-72 bg-muted animate-pulse rounded-lg"></div>
            </div>
          ) : campaigns.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedCampaign === campaign.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => handleCampaignSelect(campaign.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle>{campaign.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {campaign.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Status:</span>
                          <span
                            className={
                              campaign.active
                                ? "text-green-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            {campaign.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground mt-1">
                          <span>Reward:</span>
                          <span className="font-medium text-foreground">
                            {campaign.reward}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedCampaign && (
                <div className="space-y-8">
                  <Analytics 
                    campaignId={selectedCampaign} 
                    refreshTrigger={refreshTrigger}
                  />
                  
                  {referrals.filter(r => r.campaignId === selectedCampaign).map(referral => (
                    <ReferralLink 
                      key={referral.id}
                      code={referral.code}
                      campaignId={referral.campaignId}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="glass-card p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">No Campaigns Yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first referral campaign.
              </p>
              <Button onClick={() => setActiveTab("new")}>
                Create Campaign
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="referrals" className="space-y-4">
          {loading ? (
            <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
          ) : referrals.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Your Referral Links</h2>
              
              {referrals.map((referral) => {
                const campaign = campaigns.find(c => c.id === referral.campaignId);
                return (
                  <Card key={referral.id} className="overflow-hidden">
                    <CardHeader className="bg-secondary/30">
                      <CardTitle className="text-lg">{campaign?.title || "Campaign"}</CardTitle>
                      <CardDescription>{campaign?.description || ""}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ReferralLink code={referral.code} campaignId={referral.campaignId} />
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-secondary/30 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold">{referral.clicks}</div>
                          <div className="text-sm text-muted-foreground">Link Clicks</div>
                        </div>
                        <div className="bg-secondary/30 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold">{referral.conversions}</div>
                          <div className="text-sm text-muted-foreground">Conversions</div>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          navigate(`/r/${referral.code}`);
                        }}
                      >
                        Preview Landing Page
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="glass-card p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">No Referrals Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create a campaign first to generate referral links.
              </p>
              <Button onClick={() => setActiveTab("new")}>
                Create Campaign
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="new">
          <CampaignForm onSuccess={handleCreateCampaign} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
