import { motion } from "framer-motion";
import { Download, Smartphone, Share2, PlusSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const steps = [
  {
    icon: Share2,
    title: "Open menu",
    description: 'In your browser, tap "Share" or the menu (⋮) at the top.',
  },
  {
    icon: PlusSquare,
    title: 'Select "Add to Home Screen"',
    description: "Tap 'Add to Home Screen' from the list of options.",
  },
  {
    icon: Smartphone,
    title: "Install the app",
    description: "Hausa Math will appear on your home screen just like a regular app!",
  },
];

export default function Install() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Download className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">Install Hausa Math</h1>
          <p className="text-muted-foreground mb-10">You can use Hausa Math offline by installing it on your phone.</p>
        </motion.div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
              <Card>
                <CardContent className="p-6 flex items-start gap-4 text-left">
                  <step.icon className="w-8 h-8 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">{i + 1}. {step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
