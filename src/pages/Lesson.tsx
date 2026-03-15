import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import QuizCard from "@/components/QuizCard";
import { getTopicById, getSampleQuestions } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Lesson() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = getTopicById(topicId || "");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <Link to="/classes"><Button>Back to Classes</Button></Link>
        </div>
      </div>
    );
  }

  const questions = getSampleQuestions(topic.id);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((s) => s + 10);
  };

  const handleNext = async () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
      // Save score to database
      if (user && topic && supabase) {
        const { error } = await supabase.from("scores").insert({
          user_id: user.id,
          topic_id: topic.id,
          score: score,
          total_questions: questions.length * 10,
        });
        if (error) {
          toast({ title: "Error saving score", description: error.message, variant: "destructive" });
        }
      }
    } else {
      setCurrentQ((c) => c + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-3xl">
        <Link to={`/classes/${topic.classLevel}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to {topic.classLevel}
        </Link>

        <VideoPlayer url={topic.videoUrl} title={topic.title} />

        <div className="mt-4 mb-2">
          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">{topic.classLevel}</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>

        {!quizStarted ? (
          <>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">{topic.description}</p>
                <Button
                  onClick={() => setQuizStarted(true)}
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-semibold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Practice
                </Button>
              </CardContent>
            </Card>
          </>
        ) : finished ? (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-5xl">🎉</div>
              <h2 className="text-2xl font-bold">Well done!</h2>
              <p className="text-muted-foreground">You've completed the practice for {topic.title}</p>
              <div className="text-3xl font-bold text-primary">
                {score} / {questions.length * 10} points
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => {
                  setCurrentQ(0);
                  setScore(0);
                  setFinished(false);
                }} className="bg-primary text-primary-foreground">
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate("/classes")}>
                  Back to Classes
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <QuizCard
            question={questions[currentQ]}
            questionNumber={currentQ + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
