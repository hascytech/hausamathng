import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MathText from "@/components/MathText";
import type { QuizQuestion } from "@/lib/data";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export default function QuizCard({ question, questionNumber, totalQuestions, onAnswer, onNext }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === question.correctAnswer;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    onAnswer(selected === question.correctAnswer);
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    onNext();
  };

  return (
    <Card className="border-border">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Question {questionNumber} / {totalQuestions}</span>
          <span className="text-accent font-semibold">10 points</span>
        </div>

        <h3 className="text-lg font-semibold leading-relaxed">
          <MathText>{question.question}</MathText>
        </h3>

        <div className="space-y-3">
          {question.options.map((opt) => {
            let optionStyle = "border-border hover:border-primary/50 hover:bg-secondary/50";
            if (submitted) {
              if (opt.value === question.correctAnswer) {
                optionStyle = "border-success bg-success/10 text-success";
              } else if (opt.value === selected && !isCorrect) {
                optionStyle = "border-destructive bg-destructive/10 text-destructive";
              } else {
                optionStyle = "border-border opacity-50";
              }
            } else if (selected === opt.value) {
              optionStyle = "border-primary bg-primary/10";
            }

            return (
              <button
                key={opt.value}
                onClick={() => !submitted && setSelected(opt.value)}
                disabled={submitted}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${optionStyle}`}
              >
                <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold shrink-0">
                  {opt.label}
                </span>
                <span className="flex-1"><MathText>{opt.value}</MathText></span>
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <Button onClick={handleSubmit} disabled={!selected} className="w-full bg-primary text-primary-foreground">
            Submit Answer
          </Button>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Result badge */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span className="font-semibold">
                  {isCorrect ? "Correct! +10 points" : "Incorrect. Try again!"}
                </span>
              </div>

              {/* Step-by-step solution */}
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">Step-by-step solution:</h4>
                <ol className="space-y-1 text-sm">
                  {question.stepByStep.map((step, i) => (
                    <li key={i}><span className="font-medium">{i + 1}.</span> <MathText>{step}</MathText></li>
                  ))}
                </ol>
                <p className="text-sm text-muted-foreground mt-2"><MathText>{question.explanation}</MathText></p>
              </div>

              <Button onClick={handleNext} className="w-full bg-accent text-accent-foreground">
                Next Question <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
