import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Play, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { classLevels, getTopicsByClass } from "@/lib/data";
import { useAuth } from "@/hooks/useAuth";

export default function Classes() {
  const { classId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (classId) {
    const cls = classLevels.find((c) => c.id === classId);
    const classTopics = getTopicsByClass(classId);

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <Link to="/classes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Classes
          </Link>
          <h1 className="text-3xl font-bold mb-2">{cls?.label || classId}</h1>
          <p className="text-muted-foreground mb-8">{cls?.description} — {classTopics.length} topics</p>

          <div className="grid gap-4">
            {classTopics.map((topic, i) => (
              <motion.div key={topic.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={`/lesson/${topic.id}`}>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-2">Classes</h1>
        <p className="text-muted-foreground mb-8">Choose your class to start learning</p>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {classLevels.map((cls, i) => (
            <Link key={cls.id} to={`/classes/${cls.id}`} onClick={(e) => handleClassClick(cls.id, e)}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="hover:shadow-lg transition-shadow p-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-bold mb-1">{cls.label}</h2>
                  <p className="text-muted-foreground text-sm mb-3">{cls.description}</p>
                  <span className="text-primary font-medium">{cls.topicCount} topics →</span>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
