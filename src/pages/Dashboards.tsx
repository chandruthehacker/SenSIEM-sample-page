import { useState, useEffect, useCallback } from "react";
import { 
  BarChart3, PieChart, TrendingUp, AlertTriangle, Activity, 
  Plus, MapPin, HardDrive, Minus, TrendingDown, Globe, RefreshCw 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 🔹 MOCK DATA for dashboards
const MOCK_METRICS = {
  total_logs_today: 12450,
  total_logs_change: [5, "up"], // +5% increasing
  active_alerts: 42,
  alerts_change: [-2, "down"], // -2% decreasing
  error_rate: 3.2,
  error_rate_change: [0, "stable"],
  sources_active: 18,
  sources_change: [1, "up"],
};

const MOCK_LOG_LEVEL_DATA = [
  { name: "INFO", value: 5000 },
  { name: "WARNING", value: 1200 },
  { name: "ERROR", value: 800 },
  { name: "CRITICAL", value: 150 },
  { name: "ALERT", value: 50 },
];

const MOCK_TIME_SERIES = [
  { time: "10:00", logs: 200, alerts: 2 },
  { time: "11:00", logs: 400, alerts: 5 },
  { time: "12:00", logs: 300, alerts: 3 },
  { time: "13:00", logs: 500, alerts: 7 },
  { time: "14:00", logs: 250, alerts: 4 },
];

const MOCK_TOP_ALERTS = [
  { alert: "Failed login attempts", count: 120 },
  { alert: "SQL Injection detected", count: 80 },
  { alert: "Suspicious file upload", count: 65 },
];

const MOCK_TOP_IPS = [
  { ip: "192.168.1.10", count: 300 },
  { ip: "10.0.0.15", count: 220 },
  { ip: "172.16.5.5", count: 180 },
];

const MOCK_GEO_IPS = [
  { country: "United States", count: 400 },
  { country: "India", count: 250 },
  { country: "Germany", count: 120 },
];

const MOCK_NOISY_SOURCES = [
  { source: "nginx", count: 600 },
  { source: "auth.log", count: 450 },
  { source: "firewall", count: 300 },
];

const MOCK_SYSTEM_ERRORS = [
  { error: "Disk space low on /dev/sda1", count: 12 },
  { error: "Memory leak in apache2", count: 8 },
  { error: "Kernel panic detected", count: 3 },
];

const LOG_LEVEL_COLORS: Record<string, string> = {
  INFO: "#22c55e",      // Tailwind green-600
  WARNING: "#f59e0b",   // Tailwind amber-500
  ERROR: "#ef4444",     // Tailwind red-600
  CRITICAL: "#7c3aed",  // Tailwind violet-600
  ALERT: "#f97316",     // Tailwind orange-500
};


const Dashboards = () => {
  const [isCreateDashboardModalOpen, setIsCreateDashboardModalOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [newDashboardDescription, setNewDashboardDescription] = useState("");

  const [logLevelData, setLogLevelData] = useState<any[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [topAlertsData, setTopAlertsData] = useState<any[]>([]);
  const [topIPsData, setTopIPsData] = useState<any[]>([]);
  const [geoIPsData, setGeoIPsData] = useState<any[]>([]);
  const [noisySourcesData, setNoisySourcesData] = useState<any[]>([]);
  const [systemErrors, setSystemErrors] = useState<any[]>([]);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🔹 Mock fetch instead of API
  const fetchAllDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 500)); // fake delay
      setMetricsData(MOCK_METRICS);
      setLogLevelData(
        MOCK_LOG_LEVEL_DATA.map((item) => ({
          ...item,
          color: LOG_LEVEL_COLORS[item.name] || "#6b7280",
        }))
      );
      setTimeSeriesData(MOCK_TIME_SERIES);
      setTopAlertsData(MOCK_TOP_ALERTS);
      setTopIPsData(MOCK_TOP_IPS);
      setGeoIPsData(MOCK_GEO_IPS);
      setNoisySourcesData(MOCK_NOISY_SOURCES);
      setSystemErrors(MOCK_SYSTEM_ERRORS);
    } catch (err) {
      console.error("Error loading mock dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      fetchAllDashboardData();
      await new Promise((res) => setTimeout(res, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateDashboard = async () => {
    if (!newDashboardName.trim()) return;
    console.log("Creating dashboard:", { name: newDashboardName, description: newDashboardDescription });

    // fake dashboard creation
    setNewDashboardName("");
    setNewDashboardDescription("");
    setIsCreateDashboardModalOpen(false);
  };

  const handleDrillDown = (filterType: string, value: string) => {
    console.log(`Drill down: ${filterType}=${value}`);
  };

  const metrics = [
    {
      title: "Total Logs Today",
      value: metricsData?.total_logs_today ?? 0,
      change: metricsData?.total_logs_change?.[0],
      trend: metricsData?.total_logs_change?.[1],
      icon: Activity,
      color: "text-green-500",
    },
    {
      title: "Active Alerts",
      value: metricsData?.active_alerts ?? 0,
      change: metricsData?.alerts_change?.[0],
      trend: metricsData?.alerts_change?.[1],
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      title: "Error Rate",
      value: `${metricsData?.error_rate ?? 0}%`,
      change: metricsData?.error_rate_change?.[0],
      trend: metricsData?.error_rate_change?.[1],
      icon: TrendingDown,
      color: "text-yellow-500",
    },
    {
      title: "Sources Active",
      value: metricsData?.sources_active ?? 0,
      change: metricsData?.sources_change?.[0],
      trend: metricsData?.sources_change?.[1],
      icon: BarChart3,
      color: "text-blue-500",
    },
  ];

  const renderTrendIcon = (trend: string) => {
    let icon = <Minus className="w-4 h-4 text-gray-400" />;
    let label = "Stable";

    if (trend === "up") {
      icon = <TrendingUp className="w-4 h-4 text-green-500 animate-pulse" />;
      label = "Increasing";
    } else if (trend === "down") {
      icon = <TrendingDown className="w-4 h-4 text-red-500 animate-pulse" />;
      label = "Decreasing";
    }

    return (
      <TooltipProvider>
        <ShadcnTooltip>
          <TooltipTrigger asChild>{icon}</TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </ShadcnTooltip>
      </TooltipProvider>
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security Dashboards</h1>
            <p className="text-muted-foreground">Real-time cybersecurity analytics and insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-gradient-primary hover:shadow-cyber transition-all duration-300"
              onClick={() => setIsCreateDashboardModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Dashboard
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw
                  className={`w-4 h-4 mr-2 transition-transform ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
          </div>
        </div>

        {/* <div className="flex space-x-2 p-1 bg-muted rounded-md w-fit m-auto">
          {["All Dashboards", "My Dashboards", "Shared Dashboards", "Favorite Dashboards"].map((type) => (
            <Button
              key={type}
              variant={dashboardType === type ? "default" : "ghost"}
              onClick={() => setDashboardType(type)}
              className="px-4 py-2 text-sm"
            >
              {type}
            </Button>
          ))}
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-cyber transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className={`text-sm ${metric.color} flex items-center gap-1`}>
                      {renderTrendIcon(metric.trend as string)}
                      {metric.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                    <metric.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

          {/* Log Level Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-cyber transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Log Level Distribution
              </CardTitle>
              <CardDescription>Breakdown of log severity levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart
                    onClick={(e: any) =>
                      e?.activePayload &&
                      handleDrillDown("logLevel", e.activePayload[0].payload.name)
                    }
                  >
                    <Pie
                      data={Array.isArray(logLevelData) ? logLevelData : []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      nameKey="name"
                      paddingAngle={2}
                      stroke="#1f2937" // Tailwind zinc-800
                    >
                      {logLevelData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || "#6b7280"} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: any, name: any) => [`${value} logs`, `Level: ${name}`]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>

              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {/* Add Array.isArray check here */}
                {Array.isArray(logLevelData) && logLevelData.map((item: any, index: any) => (
                  <Badge
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full"
                    style={{ backgroundColor: item.color, color: 'white' }} // Set background and text color directly
                  >
                    <span className="font-semibold">{item.name}</span>
                    <span>({item.value})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-cyber transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Top 5 Alerts
              </CardTitle>
              <CardDescription>Most frequent alerts with their severity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.isArray(topAlertsData) && topAlertsData.slice(0, 5).map((alert: any, index: any) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => handleDrillDown('alertSource', alert.source)}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <div>
                        <p className="font-medium text-foreground">{alert.source}</p>
                        <p className="text-sm text-muted-foreground">Count: {alert.count}</p>
                      </div>
                    </div>
                    <Badge variant={
                      alert.severity === "high" ? "destructive" :
                        alert.severity === "medium" ? "secondary" : "outline"
                    }>
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 IPs by Log Volume */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-cyber transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top 10 IPs by Log Volume
              </CardTitle>
              <CardDescription>IP addresses generating the most logs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={topIPsData}
                  margin={{ top: 5, right: 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="ip" angle={-45} textAnchor="end" height={60} stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    onClick={(data: any) => handleDrillDown('ipAddress', data.ip)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-cyber transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Suspicious IPs Geo-distribution
              </CardTitle>
              <CardDescription>Geographic locations of suspicious IP activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.isArray(geoIPsData) && geoIPsData.map((geo: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => handleDrillDown('country', geo.country)}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-medium text-foreground">{geo.country}</p>
                        <p className="text-sm text-muted-foreground">{geo.ip} (Count: {geo.count})</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center text-muted-foreground text-sm mt-4">
                  (Visual map integration requires dedicated library)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Log Activity Over Time */}
        <Card className="hover:shadow-cyber transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Log Activity Over Time
            </CardTitle>
            <CardDescription>Logs and alerts throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={timeSeriesData}
                onClick={(e: any) => e.activePayload && handleDrillDown('time', e.activePayload[0].payload.time)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="logs"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  name="Log Count"
                />
                <Line
                  type="monotone"
                  dataKey="alerts"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
                  name="Alert Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/*  Most Noisy Log Sources */}
        <Card className="hover:shadow-cyber transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Most Noisy Log Sources
            </CardTitle>
            <CardDescription>Log sources generating the highest volume of logs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={noisySourcesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="source" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  onClick={(data: any) => handleDrillDown('logSource', data.source)}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Last 10 System Errors */}
        <Card className="hover:shadow-cyber transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Last 10 System Errors
            </CardTitle>
            <CardDescription>Recent critical system errors and their timestamps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(systemErrors) && systemErrors.map((error: any, index: any) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => handleDrillDown('errorMessage', error.error)}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="font-medium text-foreground">{error.error}</p>
                      <p className="text-sm text-muted-foreground">{error.source} - {error.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        <Dialog open={isCreateDashboardModalOpen} onOpenChange={setIsCreateDashboardModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Dashboard</DialogTitle>
              <DialogDescription>
                Enter the details for your new security dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dashboardName" className="text-right">
                  Name
                </Label>
                <Input
                  id="dashboardName"
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dashboardDescription" className="text-right">
                  Description
                </Label>
                <Input
                  id="dashboardDescription"
                  value={newDashboardDescription}
                  onChange={(e) => setNewDashboardDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDashboardModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateDashboard}>Create Dashboard</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Dashboards;