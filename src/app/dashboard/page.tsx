"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalysisHistoryItem {
  task_id: string;
  ticker: string;
  analysis_type: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [plan, setPlan] = useState<"free" | "pro" | "team">("free");
  const [analysesRemaining, setAnalysesRemaining] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
    });

    // Fetch plan info from API
    const fetchPlan = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const res = await fetch(`${API_URL}/user/plan`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPlan(data.plan || "free");
          setAnalysesRemaining(data.analyses_remaining ?? null);
        }
      } catch {
        // Fallback: assume free plan
        setPlan("free");
        setAnalysesRemaining(3);
      }
    };
    fetchPlan();
  }, [router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-600">Completed</Badge>;
      case "running":
        return <Badge className="bg-blue-600">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-amber-600">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-600">Failed</Badge>;
      default:
        return <Badge className="bg-gray-600">{status}</Badge>;
    }
  };

  const getPlanBadge = () => {
    switch (plan) {
      case "pro":
        return <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600">Pro</Badge>;
      case "team":
        return <Badge className="bg-gradient-to-r from-amber-600 to-orange-600">Team</Badge>;
      default:
        return <Badge className="bg-gray-600">Free</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-[#0a0a1a]">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#0a0a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome + Plan Badge */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome back, {user?.email?.split("@")[0] || "User"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getPlanBadge()}
            {analysesRemaining !== null && (
              <span className="text-sm text-gray-400">
                {analysesRemaining} / {plan === "free" ? "3" : "∞"} analyses remaining
              </span>
            )}
          </div>
        </div>

        {/* How It Works - Empty State Guidance */}
        {history.length === 0 && (
          <Card className="bg-[#12122a] border-indigo-500/10 mb-8">
            <CardContent className="py-8">
              <h2 className="text-lg font-bold text-white mb-4 text-center">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-indigo-400 font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">Enter a Ticker</h3>
                  <p className="text-gray-500 text-sm">Type a US stock ticker (e.g., AAPL, MSFT)</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-indigo-400 font-bold text-lg">2</span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">AI Analyzes</h3>
                  <p className="text-gray-500 text-sm">3 AI analysts review fundamentals, technicals, and sentiment</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-indigo-400 font-bold text-lg">3</span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">Get Your Report</h3>
                  <p className="text-gray-500 text-sm">Receive a structured report with SEC-cited sources in ~3 minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-[#12122a] border-indigo-500/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">New Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                Start a new stock analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/analyze">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white">
                  Analyze a Stock
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#12122a] border-indigo-500/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Subscription
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="w-full border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10"
                >
                  View Plans
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#12122a] border-indigo-500/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">Account</CardTitle>
              <CardDescription className="text-gray-400">
                Your profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500 truncate">
                {user?.email}
              </p>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="w-full border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10"
                >
                  Manage Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Analysis History */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            Analysis History
          </h2>

          {history.length === 0 ? (
            <Card className="bg-[#12122a] border-indigo-500/10">
              <CardContent className="py-12 text-center">
                <svg
                  className="w-12 h-12 text-gray-600 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25-2.25M12 13.875V7.5"
                  />
                </svg>
                <p className="text-gray-400 mb-4">
                  No analyses yet. Start your first one!
                </p>
                <Link href="/analyze">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white">
                    Start Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <Link key={item.task_id} href={`/analyze/${item.task_id}`}>
                  <Card className="bg-[#12122a] border-indigo-500/10 hover:border-indigo-500/30 transition-colors cursor-pointer">
                    <CardContent className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-white font-semibold">
                          {item.ticker.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {item.analysis_type} analysis
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString("en-US")}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
