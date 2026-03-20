import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Play, Users, Video, Brain, Star, GraduationCap, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { classLevels } from "@/lib/data";
import { useState, useEffect } from "react";
import hm1 from "@/assets/hm_1.png";
import hm2 from "@/assets/hm_2.png";
import hm3 from "@/assets/hm_3.png";
import hm4 from "@/assets/hm_4.png";

const heroImages = [hm1, hm2, hm3, hm4];

const stats = [
  { value: "500+", label: "Students Enrolled", icon: Users },
  { value: "50+", label: "Video Lessons", icon: Video },
  { value: "92%", label: "Pass Rate", icon: Brain },
  { value: "4.8★", label: "Student Rating", icon: Star },
];

const testimonials = [
  {
    name: "Aminu Ibrahim",
    role: "SS3 Student, Kano",
    quote: "Hausa Math helped me understand Mathematics easily. I got an A1 in WAEC!",
  },
  {
    name: "Fatima Yusuf",
    role: "SS2 Student, Kaduna",
    quote: "I learn math on my phone anywhere. The lessons are great and easy to follow.",
  },
  {
    name: "Musa Abdullahi",
    role: "SS1 Student, Sokoto",
    quote: "The AI quizzes helped me a lot. Now I understand algebra and trigonometry.",
  },
];

const partners = [
  "WAEC", "NECO", "Ministry of Education", "UNICEF", "UNESCO",
];

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClassClick = (classId: string, e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="container py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Hausa Math</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">Learn Mathematics in Hausa. Watch. Practice. Master.</p>
          <Link to={user ? "/classes" : "/login"}>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 h-14">
              <Play className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
          </Link>
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full bg-secondary border-2 border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                S{i}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Statistics */}
      <section className="container pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="text-center p-6">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground">Three simple steps to master Mathematics in Hausa</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Video, title: "Watch", desc: "Video lessons taught entirely in Hausa by expert teachers" },
            { icon: Brain, title: "Practice", desc: "AI-generated quizzes with step-by-step solutions in Hausa" },
            { icon: GraduationCap, title: "Master", desc: "Track your progress and prepare for WAEC & NECO exams" },
          ].map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
              <Card className="text-center p-8">
                <step.icon className="w-10 h-10 mx-auto mb-4 text-accent" />
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Classes */}
      <section className="container pb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Classes</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {classLevels.map((cls, i) => (
            <Link key={cls.id} to={`/classes/${cls.id}`} onClick={(e) => handleClassClick(cls.id, e)}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="hover:shadow-lg transition-shadow p-6 text-center">
                  <BookOpen className="w-10 h-10 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-1">{cls.label}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{cls.description}</p>
                  <span className="text-sm text-primary font-medium">{cls.topicCount} topics</span>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">What Students Say</h2>
          <p className="text-muted-foreground">Hear from students already using Hausa Math</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="p-6">
                <CardContent className="p-0 space-y-4">
                  <p className="italic text-muted-foreground">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="container pb-16 text-center">
        <p className="text-sm text-muted-foreground mb-4">Aligned with</p>
        <div className="flex flex-wrap justify-center gap-4">
          {partners.map((p) => (
            <span key={p} className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground">{p}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20 text-center">
        <Card className="bg-primary text-primary-foreground p-10">
          <h2 className="text-3xl font-bold mb-4">Ready to Master Mathematics?</h2>
          <p className="mb-6 opacity-90">Join hundreds of Hausa-speaking students already learning math the easy way.</p>
          <Link to={user ? "/classes" : "/login?mode=signup"}>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
              Start Now — It's Free
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
