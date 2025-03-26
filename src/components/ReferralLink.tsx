
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReferralLinkProps {
  code: string;
  campaignId: string;
}

const ReferralLink = ({ code, campaignId }: ReferralLinkProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Generate the full referral URL
  const baseUrl = window.location.origin;
  const referralUrl = `${baseUrl}/r/${code}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Referral link copied to clipboard.",
      });
      
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Couldn't copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Generate share links
  const shareTwitter = () => {
    const text = encodeURIComponent("Check out this awesome offer I found!");
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralUrl)}&text=${text}`, "_blank");
  };
  
  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`, "_blank");
  };
  
  const shareWhatsapp = () => {
    const text = encodeURIComponent("Check out this awesome offer I found!\n\n" + referralUrl);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };
  
  const shareEmail = () => {
    const subject = encodeURIComponent("Check out this referral");
    const body = encodeURIComponent(`I thought you might be interested in this offer:\n\n${referralUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };
  
  return (
    <div className="glass-card p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Your Referral Link</h3>
      
      <div className="flex items-center mb-4">
        <Input
          value={referralUrl}
          readOnly
          className="font-mono text-sm flex-grow bg-white bg-opacity-60"
        />
        <Button
          variant="outline"
          size="icon"
          className="ml-2 h-10 w-10"
          onClick={copyToClipboard}
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Share via:</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shareTwitter}
            className="bg-[#1DA1F2] bg-opacity-10 hover:bg-opacity-20 text-[#1DA1F2]"
          >
            Twitter
          </Button>
          <Button
            variant="outline" 
            size="sm"
            onClick={shareFacebook}
            className="bg-[#4267B2] bg-opacity-10 hover:bg-opacity-20 text-[#4267B2]"
          >
            Facebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareWhatsapp}
            className="bg-[#25D366] bg-opacity-10 hover:bg-opacity-20 text-[#25D366]"
          >
            WhatsApp
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareEmail}
            className="bg-muted bg-opacity-30 hover:bg-opacity-50"
          >
            Email
          </Button>
        </div>
      </div>
      
      <div className="mt-4 text-sm">
        <span className="text-muted-foreground">Code: </span>
        <span className="font-medium">{code}</span>
      </div>
    </div>
  );
};

export default ReferralLink;
