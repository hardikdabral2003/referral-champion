
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import Chatbot from "@/components/Chatbot";

const ReferralPage = () => {
  const { referralId } = useParams<{ referralId: string }>();
  const { toast } = useToast();
  const [referral, setReferral] = useState<any | null>(null);
  const [campaign, setCampaign] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!referralId) return;
      
      setLoading(true);
      
      try {
        // Track click
        await api.trackReferralClick(referralId);
        
        // Get referral info
        const referralData = await api.getReferral(referralId);
        if (!referralData) {
          throw new Error("Referral not found");
        }
        
        setReferral(referralData);
        
        // Get campaign info
        const campaignData = await api.getCampaign(referralData.campaignId);
        if (!campaignData) {
          throw new Error("Campaign not found");
        }
        
        setCampaign(campaignData);
      } catch (error) {
        console.error("Error fetching referral data:", error);
        toast({
          title: "Error",
          description: "This referral link is invalid or has expired.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferralData();
  }, [referralId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !referralId) return;
    
    try {
      // Track conversion
      await api.trackReferralConversion(referralId);
      
      // Show success
      setSubmitted(true);
      
      toast({
        title: "Success!",
        description: "You've successfully signed up for this offer.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem processing your submission. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="glass-card p-8 text-center animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!referral || !campaign) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[80vh]">
        <div className="glass-card p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Invalid Referral</h1>
          <p className="text-muted-foreground mb-6">
            This referral link is invalid or has expired.
          </p>
          <Link to="/">
            <Button>Return to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-[80vh] relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 -left-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {submitted ? (
          <div className="glass-card p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-6">
              You've successfully signed up for this special offer. Your reward will be processed shortly.
            </p>
            <Link to="/">
              <Button>Return to Homepage</Button>
            </Link>
          </div>
        ) : (
          <div className="glass-card p-8 md:p-12">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{campaign.title}</h1>
            <p className="text-muted-foreground mb-6">{campaign.description}</p>
            
            <div className="bg-secondary/50 rounded-lg p-4 mb-8 animate-pulse-subtle">
              <h2 className="text-lg font-medium mb-2">Special Reward:</h2>
              <p className="text-primary font-semibold">{campaign.reward}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Enter your email to claim this offer:
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white bg-opacity-70"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Claim Your Reward
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                By submitting, you agree to our terms and privacy policy.
              </p>
            </form>
          </div>
        )}
      </div>
      
      {/* Chatbot */}
      {!submitted && referral && campaign && (
        <Chatbot 
          campaignId={campaign.id} 
          referralCode={referral.code} 
        />
      )}
    </div>
  );
};

export default ReferralPage;
