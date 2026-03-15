import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import LeaderboardTable from "@/components/LeaderboardTable";
import { supabase } from "@/integrations/supabase/client";
import { leaderboardData } from "@/lib/data";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  accuracy: number;
}

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setData(leaderboardData);
      setLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      const { data: rows } = await supabase
        .from("leaderboard")
        .select("*")
        .limit(20);

      if (rows) {
        setData(
          rows.map((r: any, i: number) => ({
            rank: i + 1,
            name: r.name || "Anonymous",
            points: Number(r.points) || 0,
            accuracy: Number(r.accuracy) || 0,
          }))
        );
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2 text-center">Student Rankings</h1>
          <p className="text-muted-foreground text-center mb-8">Top students with the highest scores</p>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : data.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No scores yet. Be the first to practice!</div>
              ) : (
                <LeaderboardTable data={data} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
