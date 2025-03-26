
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <div className="relative">
      {/* Decorative blurred gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-primary/30 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: "1s" }}></div>
      </div>
      
      <div className="container max-w-6xl px-4 mx-auto pt-16 pb-24 md:pt-24 md:pb-32 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 animate-fade-in">
            Launch Your Referral Program Today
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
            Grow Your Business with <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Powerful Referrals</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Create customized referral campaigns that drive growth. Simple to set up, powerful to use,
            and designed to help your business thrive.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-6 text-base shadow-md hover:shadow-lg transition-shadow">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="px-8 py-6 text-base shadow-md hover:shadow-lg transition-shadow">
                Get Started
              </Button>
            )}
            
            <Button size="lg" variant="outline" className="px-8 py-6 text-base">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="bg-secondary/50 border-y border-border py-12">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">93%</div>
              <p className="text-muted-foreground">Of customers trust referrals from people they know</p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.2x</div>
              <p className="text-muted-foreground">Higher conversion rate with referred customers</p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">37%</div>
              <p className="text-muted-foreground">Higher retention rate for referred customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
