
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface CampaignFormProps {
  onSuccess?: (campaignId: string) => void;
}

const CampaignForm = ({ onSuccess }: CampaignFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to create a campaign",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const newCampaign = await api.createCampaign({
        ...formData,
        active: true,
        createdBy: user.id,
      });
      
      toast({
        title: "Campaign created!",
        description: "Your new referral campaign has been created successfully.",
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        reward: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(newCampaign.id);
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-semibold mb-4">Create a New Campaign</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Campaign Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Summer Promotion"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe what this campaign is about..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reward">Reward</Label>
          <Input
            id="reward"
            name="reward"
            placeholder="$10 off next purchase"
            value={formData.reward}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Campaign"}
        </Button>
      </form>
    </div>
  );
};

export default CampaignForm;
