import { motion } from "framer-motion";
import { Target, CheckCircle2, Percent, Star, BookCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const stats = [
  { label: "Questions", value: "45", icon: Target, color: "text-primary" },
  { label: "Correct", value: "38", icon: CheckCircle2, color: "text-success" },
  { label: "Accuracy", value: "84%", icon: Percent, color: "text-accent" },
  { label: "Points", value: "380", icon: Star, color: "text-gold" },
  { label: "Topics", value: "6", icon: BookCheck, color: "text-primary" },
];

const recentActivity = [
  { topic: "Linear Equations", date: "Today", score: "40/50" },
  { topic: "Indices", date: "Yesterday", score: "30/50" },
  { topic: "Trigonometry", date: "3 days ago", score: "50/50" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome! Here's your progress.</p>

        {/* Continue card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <p className="text-sm opacity-80 mb-1">Continue learning</p>
              <h3 className="text-xl font-bold mb-1">Trigonometry</h3>
              <p className="text-sm opacity-80 mb-4">SS2 · 3/5 questions</p>
              <Link to="/lesson/trigonometry">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Continue →</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="text-center p-4">
                <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent activity */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.topic} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{activity.topic}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{activity.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
