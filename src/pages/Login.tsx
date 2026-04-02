import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setIsSignup(searchParams.get("mode") === "signup");
  }, [searchParams]);

  useEffect(() => {
    if (user) navigate("/classes");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-md">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-center mb-2">{isSignup ? "Create Account" : "Login"}</h1>
          <p className="text-muted-foreground text-center mb-8">
            {isSignup ? "Create a new account to start learning" : "Log in to your account to continue"}
          </p>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-1">
                      <User className="w-4 h-4" /> Name
                    </label>
                    <Input
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium mb-1 flex items-center gap-1">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 flex items-center gap-1">
                    <Lock className="w-4 h-4" /> Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isSignup ? "Create Account" : "Login"}
                </Button>
              </form>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <p className="text-center text-sm mt-4 text-muted-foreground">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-primary font-medium hover:underline"
                >
                  {isSignup ? "Login" : "Create Account"}
                </button>
              </p>

              {/* Forgot Password Dialog */}
              {showForgot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowForgot(false)}>
                  <div className="bg-background rounded-lg p-6 w-full max-w-sm mx-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-bold mb-2">Reset Password</h3>
                    <p className="text-sm text-muted-foreground mb-4">Enter your email and we'll send you a link to reset your password.</p>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setForgotLoading(true);
                        try {
                          const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
                            redirectTo: `${window.location.origin}/reset-password`,
                          });
                          if (error) throw error;
                          toast({ title: "Email Sent", description: "Check your inbox for a password reset link." });
                          setShowForgot(false);
                          setForgotEmail("");
                        } catch (err: any) {
                          toast({ title: "Error", description: err.message, variant: "destructive" });
                        } finally {
                          setForgotLoading(false);
                        }
                      }}
                      className="space-y-3"
                    >
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                      <Button type="submit" disabled={forgotLoading} className="w-full bg-primary text-primary-foreground">
                        {forgotLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Send Reset Link
                      </Button>
                    </form>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
