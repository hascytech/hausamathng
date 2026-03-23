import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Play, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { classLevels } from "@/lib/data";
import { useTopics } from "@/hooks/useTopics";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Classes() {
  const { classId } = useParams();

  if (classId) {
    return <ClassDetail classId={classId} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-2">Classes</h1>
        <p className="text-muted-foreground mb-8">Choose your class to start learning</p>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {classLevels.map((cls, i) => (
            <Link key={cls.id} to={`/classes/${cls.id}`}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="hover:shadow-lg transition-shadow p-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-bold mb-1">{cls.label}</h2>
                  <p className="text-muted-foreground text-sm mb-3">{cls.description}</p>
                  <span className="text-primary font-medium">View topics →</span>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassDetail({ classId }: { classId: string }) {
  const cls = classLevels.find((c) => c.id === classId);
  const { topics, loading } = useTopics(classId);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTopicClick = (e: React.MouseEvent, topicId: string) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Login Required",
        description: "Access to video lessons is exclusive for logged in users. Please log in or sign up to continue.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <Link to="/classes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Classes
        </Link>
        <h1 className="text-3xl font-bold mb-2">{cls?.label || classId}</h1>
        <p className="text-muted-foreground mb-8">{cls?.description} — {topics.length} topics</p>

        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        ) : (
          <div className="grid gap-4">
            {topics.map((topic, i) => (
              <motion.div key={topic.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={`/lesson/${topic.id}`} onClick={(e) => handleTopicClick(e, topic.id)}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary shrink-0">
                        <Play className="w-4 h-4 mr-1" /> Open →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
