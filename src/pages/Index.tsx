
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const Index = () => {
  // Feature list
  const features = [
    {
      title: "Create Custom Campaigns",
      description: "Set up and customize referral campaigns tailored to your business needs."
    },
    {
      title: "Unique Referral Links",
      description: "Generate personalized referral links that are easy to share and track."
    },
    {
      title: "Smart Chatbot",
      description: "Engage visitors with an intelligent chatbot that guides them through the referral process."
    },
    {
      title: "Task & Reward Management",
      description: "Define tasks for referrals to complete and the rewards they'll earn."
    },
    {
      title: "Powerful Analytics",
      description: "Track performance with detailed analytics on clicks, conversions, and more."
    },
    {
      title: "Seamless Integration",
      description: "Easily integrate with your existing systems and workflow."
    }
  ];

  return (
    <>
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Powerful Features to Supercharge Your Growth
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides everything you need to create, manage, and optimize your referral campaigns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-card p-6 card-hover"
              >
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/dashboard">
              <Button size="lg" className="px-8">Get Started Today</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-secondary/50 border-y border-border">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started with Referral Champion is simple and straightforward.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create a Campaign</h3>
              <p className="text-muted-foreground">
                Set up your referral campaign with custom rewards and messaging.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Referral Links</h3>
              <p className="text-muted-foreground">
                Distribute unique referral links to your existing customers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Track & Reward</h3>
              <p className="text-muted-foreground">
                Monitor performance and automatically distribute rewards.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of businesses using Referral Champion to accelerate their growth through the power of referrals.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="px-8 py-6 text-base font-medium">
                Start Your First Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
