import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import QuizCard from "@/components/QuizCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTopicById } from "@/hooks/useTopics";
import type { QuizQuestion } from "@/lib/data";

export default function Lesson() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { topic, loading: topicLoading } = useTopicById(topicId || "");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  if (topicLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("topic_id", topic.id);

      if (error) throw error;

      if (!data || data.length === 0) {
        const { data: genData, error: genError } = await supabase.functions.invoke("generate-quiz", {
          body: { topicId: topic.id, topicTitle: topic.title, topicDescription: topic.description, classLevel: topic.class_level },
        });

        if (genError) throw genError;
        if (genData?.error) {
          toast({ title: "Error generating quiz", description: genData.error, variant: "destructive" });
          setLoading(false);
          return;
        }

        const { data: newData, error: newError } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("topic_id", topic.id);

        if (newError) throw newError;
        if (newData) pickRandomQuestions(newData);
      } else {
        pickRandomQuestions(data);
      }
    } catch (e: any) {
      console.error("Error fetching questions:", e);
      toast({ title: "Error loading quiz", description: e.message || "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const pickRandomQuestions = (allQuestions: any[]) => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    const mapped: QuizQuestion[] = selected.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options as { label: string; value: string }[],
      correctAnswer: q.correct_answer,
      stepByStep: q.step_by_step as string[],
      explanation: q.explanation,
    }));
    setQuestions(mapped);
  };

  const handleStartQuiz = async () => {
    await fetchQuestions();
    setQuizStarted(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = async () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
      if (user && supabase) {
        const { error } = await supabase.from("scores").insert({
          user_id: user.id,
          topic_id: topic.id,
          score: score,
          total_questions: questions.length,
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
        <Link to={`/classes/${topic.class_level}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to {topic.class_level}
        </Link>

        <div className="mb-2">
          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">{topic.class_level}</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>

        <VideoPlayer url={topic.video_url} title={topic.title} />

        {!quizStarted ? (
          <Card className="mt-6">
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-lg font-medium text-foreground">
                🎯 Ready to test what you've learned?
              </p>
              <p className="text-muted-foreground">
                Take a quick quiz to reinforce your understanding and earn points on the leaderboard!
              </p>
              <Button
                onClick={handleStartQuiz}
                disabled={loading}
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Quiz
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : finished ? (
          <Card className="mt-6">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-5xl">🎉</div>
              <h2 className="text-2xl font-bold">Well done!</h2>
              <p className="text-muted-foreground">You've completed the quiz for {topic.title}</p>
              <div className="text-3xl font-bold text-primary">
                {score} / {questions.length} correct
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => {
                  setCurrentQ(0);
                  setScore(0);
                  setFinished(false);
                  setQuizStarted(false);
                }} className="bg-primary text-primary-foreground">
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate("/classes")}>
                  Back to Classes
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : questions.length > 0 ? (
          <div className="mt-6">
            <QuizCard
              question={questions[currentQ]}
              questionNumber={currentQ + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          </div>
        ) : (
          <Card className="mt-6">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading quiz questions...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
