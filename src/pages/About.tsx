import { motion } from "framer-motion";
import { Globe, BookOpen, Brain, Users, Trophy, Smartphone, GraduationCap, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const challenges = [
  { challenge: "Language Barrier", solution: "Teaches math concepts in Hausa, not just English", icon: Globe },
  { challenge: "Exam Preparation", solution: "Prepares students for WAEC & NECO with targeted content", icon: GraduationCap },
  { challenge: "Access to Quality Education", solution: "Free video lessons for students in remote areas", icon: Smartphone },
  { challenge: "Interactive Learning", solution: "AI-generated quizzes provide instant feedback", icon: Brain },
  { challenge: "Progress Tracking", solution: "Students can monitor their improvement over time", icon: Trophy },
];

const values = [
  { title: "Accessibility", desc: "Making quality math education available to every Hausa-speaking student, regardless of location or economic status.", icon: Heart },
  { title: "Mother-tongue Learning", desc: "Research shows students learn best in their first language. We teach in Hausa so concepts click faster.", icon: Globe },
  { title: "Technology-driven", desc: "Leveraging AI, video, and mobile-first design to deliver a modern learning experience.", icon: Smartphone },
  { title: "Community", desc: "Building a community of learners who support each other through leaderboards and shared progress.", icon: Users },
];

export default function About() {
  const fade = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.1, duration: 0.4 },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="container py-16 max-w-3xl">
        <motion.div {...fade(0)} className="text-center">
          <h1 className="text-4xl font-bold mb-4">About Hausa Math</h1>
          <p className="text-muted-foreground text-lg">
            Hausa Math is an educational platform that makes secondary school mathematics accessible to Hausa-speaking students. We bridge the gap between traditional schooling and digital learning, ensuring that language is no longer a barrier to understanding mathematics.
          </p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="container pb-16 max-w-3xl">
        <motion.div {...fade(1)}>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="opacity-90">
                To provide free, high-quality mathematics education in Hausa language to every secondary school student in Northern Nigeria and beyond. We believe that every student deserves to learn in the language they think in — and that technology can make this possible at scale.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Problem & Solution */}
      <section className="container pb-16 max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-8">Why Hausa Math Matters</h2>
        <div className="space-y-4">
          {challenges.map((item, i) => (
            <motion.div key={i} {...fade(i)}>
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <item.icon className="w-8 h-8 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">{item.challenge}</h3>
                    <p className="text-sm text-muted-foreground">{item.solution}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What We Offer */}
      <section className="container pb-16 max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-8">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <BookOpen className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold mb-2">Video Lessons in Hausa</h3>
            <p className="text-sm text-muted-foreground">Every topic from SS1 to SS3 is taught through clear, engaging video lessons delivered entirely in Hausa language by experienced teachers.</p>
          </Card>
          <Card className="p-6">
            <Brain className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-bold mb-2">AI-Powered Quizzes</h3>
            <p className="text-sm text-muted-foreground">After each lesson, our AI generates unique quiz questions with step-by-step explanations so you truly understand the concepts.</p>
          </Card>
          <Card className="p-6">
            <Trophy className="w-8 h-8 text-gold mb-3" />
            <h3 className="font-bold mb-2">Leaderboard & Progress</h3>
            <p className="text-sm text-muted-foreground">Track your scores, compete with classmates, and see how you rank on the leaderboard. Gamification keeps learning fun and motivating.</p>
          </Card>
          <Card className="p-6">
            <Smartphone className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold mb-2">Mobile-First Design</h3>
            <p className="text-sm text-muted-foreground">Designed for phones first. Learn anywhere — at home, in school, or on the go. Install it as an app on your device for offline access.</p>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="container pb-16 max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div key={i} {...fade(i)}>
              <Card className="p-6">
                <v.icon className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="container pb-20 max-w-3xl text-center">
        <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
        <p className="text-muted-foreground mb-4">Have questions, suggestions, or want to partner with us?</p>
        <a href="mailto:contact@hausamath.com" className="text-primary font-medium hover:underline">
          contact@hausamath.com
        </a>
      </section>
    </div>
  );
}
