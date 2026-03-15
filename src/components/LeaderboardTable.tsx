import { Trophy } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  accuracy: number;
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  compact?: boolean;
}

export default function LeaderboardTable({ data, compact }: LeaderboardTableProps) {
  const entries = compact ? data.slice(0, 5) : data;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="p-3">Rank</th>
            <th className="p-3">Name</th>
            <th className="p-3">Points</th>
            {!compact && <th className="p-3">Accuracy</th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.rank} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="p-3">
                {entry.rank <= 3 ? (
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    entry.rank === 1 ? "bg-gold text-gold-foreground" :
                    entry.rank === 2 ? "bg-muted text-foreground" :
                    "bg-accent/30 text-accent-foreground"
                  }`}>
                    {entry.rank === 1 && <Trophy className="w-3.5 h-3.5" />}
                    {entry.rank !== 1 && entry.rank}
                  </span>
                ) : (
                  <span className="pl-2">{entry.rank}</span>
                )}
              </td>
              <td className="p-3 font-medium">{entry.name}</td>
              <td className="p-3 text-accent font-semibold">{entry.points}</td>
              {!compact && <td className="p-3">{entry.accuracy}%</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
