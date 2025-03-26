
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { api } from "@/services/api";

interface AnalyticsProps {
  campaignId?: string;
  refreshTrigger?: number;
}

interface AnalyticsData {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
}

const Analytics = ({ campaignId, refreshTrigger = 0 }: AnalyticsProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await api.getAnalytics(campaignId);
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [campaignId, refreshTrigger]);

  // Sample data for the chart
  const chartData = [
    { name: "Week 1", clicks: 12, conversions: 3 },
    { name: "Week 2", clicks: 19, conversions: 5 },
    { name: "Week 3", clicks: 15, conversions: 4 },
    { name: "Week 4", clicks: 27, conversions: 8 },
  ];

  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-6 w-1/3 bg-muted rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
        </div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-semibold mb-6">Campaign Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics?.totalClicks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Link interactions
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics?.totalConversions || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed tasks
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics?.conversionRate.toFixed(1) || 0}%
            </div>
            <div className="mt-2">
              <Progress value={analytics?.conversionRate || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="h-[300px] mt-8">
        <h3 className="text-lg font-medium mb-4">Performance Over Time</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #f0f0f0",
                borderRadius: "8px"
              }} 
            />
            <Bar dataKey="clicks" fill="rgba(14, 165, 233, 0.6)" radius={[4, 4, 0, 0]} name="Clicks" />
            <Bar dataKey="conversions" fill="rgba(14, 165, 233, 1)" radius={[4, 4, 0, 0]} name="Conversions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
