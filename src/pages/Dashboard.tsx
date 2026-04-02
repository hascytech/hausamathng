import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Percent, Star, BookCheck, Trophy, Loader2, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalQuestions: number;
  totalCorrect: number;
  accuracy: number;
  points: number;
  topicsAttempted: number;
  leaderboardPosition: number | null;
}

interface RecentScore {
  topic_id: string;
  score: number;
  total_questions: number;
  created_at: string;
  topicTitle?: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      setLoading(true);

      // Fetch user scores
      const { data: scores } = await supabase
        .from("scores")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      const allScores = scores || [];
      const totalQuestions = allScores.reduce((sum, s) => sum + s.total_questions, 0);
      const totalCorrect = allScores.reduce((sum, s) => sum + s.score, 0);
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      const points = totalCorrect;
      const topicsAttempted = new Set(allScores.map((s) => s.topic_id)).size;

      // Fetch leaderboard position
      const { data: leaderboard } = await supabase
        .from("leaderboard")
        .select("*")
        .order("points", { ascending: false });

      const userName = user!.user_metadata?.name;
      let leaderboardPosition: number | null = null;
      if (leaderboard && userName) {
        const idx = leaderboard.findIndex((l) => l.name === userName);
        if (idx !== -1) leaderboardPosition = idx + 1;
      }

      setStats({ totalQuestions, totalCorrect, accuracy, points, topicsAttempted, leaderboardPosition });

      // Fetch recent activity with topic titles
      const recent = allScores.slice(0, 5);
      const topicIds = [...new Set(recent.map((r) => r.topic_id))];
      const { data: topics } = await supabase
        .from("topics")
        .select("id, title")
        .in("id", topicIds.length > 0 ? topicIds : ["__none__"]);

      const topicMap = new Map((topics || []).map((t) => [t.id, t.title]));
      setRecentActivity(
        recent.map((r) => ({ ...r, topicTitle: topicMap.get(r.topic_id) || r.topic_id }))
      );

      setLoading(false);
    }

    fetchStats();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Questions", value: stats.totalQuestions.toString(), icon: Target, color: "text-primary" },
    { label: "Correct", value: stats.totalCorrect.toString(), icon: CheckCircle2, color: "text-green-600" },
    { label: "Accuracy", value: `${stats.accuracy}%`, icon: Percent, color: "text-accent" },
    { label: "Points", value: stats.points.toString(), icon: Star, color: "text-yellow-500" },
    { label: "Topics", value: stats.topicsAttempted.toString(), icon: BookCheck, color: "text-primary" },
    { label: "Rank", value: stats.leaderboardPosition ? `#${stats.leaderboardPosition}` : "—", icon: Trophy, color: "text-accent" },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome, {user?.user_metadata?.name || "Student"}! Here's your progress.</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="text-center p-4">
                <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Reset Password link */}
        <div className="mb-8">
          <button
            onClick={async () => {
              try {
                const { error } = await supabase.auth.resetPasswordForEmail(user!.email!, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) throw error;
                toast({ title: "Email Sent", description: "Check your inbox for a password reset link." });
              } catch (err: any) {
                toast({ title: "Error", description: err.message, variant: "destructive" });
              }
            }}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Lock className="w-4 h-4" /> Reset Password
          </button>
        </div>

        {/* Recent activity */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">You haven't taken any quizzes yet.</p>
                <Link to="/classes">
                  <Button className="bg-primary text-primary-foreground">Start Learning</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{activity.topicTitle}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {activity.score}/{activity.total_questions}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
