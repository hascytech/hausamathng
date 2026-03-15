import { useState } from "react";
import { motion } from "framer-motion";
import { Users, FileQuestion, BarChart3, BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import { topics as allTopics } from "@/lib/data";

const adminStats = [
  { label: "Users", value: "234", icon: Users },
  { label: "Quizzes", value: "1,456", icon: FileQuestion },
  { label: "Accuracy", value: "76%", icon: BarChart3 },
  { label: "Topics", value: "9", icon: BookOpen },
];

const popularTopics = [
  { name: "Linear Equations", attempts: 342 },
  { name: "Trigonometry", attempts: 289 },
  { name: "Probability", attempts: 245 },
];

export default function Admin() {
  const [localTopics, setLocalTopics] = useState(allTopics);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground mb-8">Manage platform and topics</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {adminStats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="text-center p-4">
                <stat.icon className="w-6 h-6 mx-auto mb-1 text-primary" />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Popular topics */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">Popular Topics</h2>
            {popularTopics.map((t) => (
              <div key={t.name} className="flex justify-between py-2 border-b border-border last:border-0">
                <span>{t.name}</span>
                <span className="text-muted-foreground">{t.attempts} attempts</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Topic management */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Manage Topics</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Topic</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Topic</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <Input placeholder="Topic title" />
                    <Textarea placeholder="Description" />
                    <Input placeholder="Video URL" />
                    <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background">
                      <option>SS1</option>
                      <option>SS2</option>
                      <option>SS3</option>
                    </select>
                    <Button type="submit" className="w-full">Save</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-2">
              {localTopics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <span className="font-medium">{topic.title}</span>
                    <span className="text-xs ml-2 text-muted-foreground">{topic.classLevel}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
