import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, FileQuestion, BarChart3, BookOpen, Plus, Pencil, Trash2,
  Shield, Save, X, Loader2, UserPlus, Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTopics, type DbTopic } from "@/hooks/useTopics";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { topics: dbTopics, loading: topicsLoading, refetch: refetchTopics } = useTopics();

  const [editingTopic, setEditingTopic] = useState<DbTopic | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: "", description: "", video_url: "", class_level: "SS1" });
  const [saving, setSaving] = useState(false);

  // Users & roles
  const [allUsers, setAllUsers] = useState<{ user_id: string; name: string | null }[]>([]);
  const [adminUsers, setAdminUsers] = useState<{ user_id: string; role: string }[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Scores
  const [allScores, setAllScores] = useState<any[]>([]);
  const [scoresLoading, setScoresLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({ users: 0, quizzes: 0, topics: 0 });

  useEffect(() => {
    if (!authLoading && !adminLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchAdminRoles();
      fetchScores();
    }
  }, [isAdmin]);

  useEffect(() => {
    setStats((s) => ({ ...s, topics: dbTopics.length }));
  }, [dbTopics]);

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("user_id, name");
    if (data) {
      setAllUsers(data);
      setStats((s) => ({ ...s, users: data.length }));
    }
  };

  const fetchAdminRoles = async () => {
    const { data } = await supabase.from("user_roles").select("user_id, role");
    if (data) setAdminUsers(data);
  };

  const fetchScores = async () => {
    setScoresLoading(true);
    const { data } = await supabase.from("scores").select("*").order("created_at", { ascending: false }).limit(100);
    if (data) {
      setAllScores(data);
      setStats((s) => ({ ...s, quizzes: data.length }));
    }
    setScoresLoading(false);
  };

  // Topic CRUD — database
  const handleSaveNewTopic = async () => {
    if (!newTopic.title) return;
    setSaving(true);
    const id = newTopic.title.toLowerCase().replace(/\s+/g, "-");
    const existing = dbTopics.filter((t) => t.class_level === newTopic.class_level);
    const { error } = await supabase.from("topics").insert({
      id,
      class_level: newTopic.class_level,
      title: newTopic.title,
      description: newTopic.description,
      video_url: newTopic.video_url,
      order: existing.length + 1,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Topic added" });
      setNewTopic({ title: "", description: "", video_url: "", class_level: "SS1" });
      setAddOpen(false);
      refetchTopics();
    }
  };

  const handleUpdateTopic = async () => {
    if (!editingTopic) return;
    setSaving(true);
    const { error } = await supabase.from("topics").update({
      title: editingTopic.title,
      description: editingTopic.description,
      video_url: editingTopic.video_url,
      class_level: editingTopic.class_level,
    }).eq("id", editingTopic.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Topic updated" });
      setEditingTopic(null);
      refetchTopics();
    }
  };

  const handleDeleteTopic = async (id: string) => {
    const { error } = await supabase.from("topics").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Topic deleted" });
      refetchTopics();
    }
  };

  // Assign admin
  const handleAssignAdmin = async () => {
    if (!newAdminEmail) return;
    setAssignLoading(true);
    const { error } = await supabase.functions.invoke("assign-admin", {
      body: { email: newAdminEmail },
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Admin assigned", description: `${newAdminEmail} is now an admin` });
      setNewAdminEmail("");
      fetchAdminRoles();
    }
    setAssignLoading(false);
  };

  // Remove admin
  const handleRemoveAdmin = async (userId: string) => {
    if (userId === user?.id) {
      toast({ title: "Error", description: "You cannot remove your own admin role", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Admin removed" });
      fetchAdminRoles();
    }
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const getUserName = (userId: string) => {
    const u = allUsers.find((p) => p.user_id === userId);
    return u?.name || userId.slice(0, 8) + "…";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground mb-8">Manage platform, topics, users & scores</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Users", value: stats.users, icon: Users },
            { label: "Quiz Attempts", value: stats.quizzes, icon: FileQuestion },
            { label: "Topics", value: stats.topics, icon: BookOpen },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="text-center p-4">
                <stat.icon className="w-6 h-6 mx-auto mb-1 text-primary" />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="topics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="topics"><BookOpen className="w-4 h-4 mr-1" /> Topics</TabsTrigger>
            <TabsTrigger value="users"><Shield className="w-4 h-4 mr-1" /> Admins</TabsTrigger>
            <TabsTrigger value="scores"><Eye className="w-4 h-4 mr-1" /> All Scores</TabsTrigger>
            <TabsTrigger value="all-users"><Users className="w-4 h-4 mr-1" /> Users</TabsTrigger>
          </TabsList>

          {/* TOPICS TAB */}
          <TabsContent value="topics">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Manage Topics</h2>
                  <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Topic</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Add New Topic</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Topic title" value={newTopic.title} onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })} />
                        <Textarea placeholder="Description" value={newTopic.description} onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })} />
                        <Input placeholder="Video URL" value={newTopic.video_url} onChange={(e) => setNewTopic({ ...newTopic, video_url: e.target.value })} />
                        <select
                          className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                          value={newTopic.class_level}
                          onChange={(e) => setNewTopic({ ...newTopic, class_level: e.target.value })}
                        >
                          <option value="SS1">SS1</option>
                          <option value="SS2">SS2</option>
                          <option value="SS3">SS3</option>
                        </select>
                        <Button onClick={handleSaveNewTopic} disabled={saving} className="w-full">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                          Save
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {topicsLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  (["SS1", "SS2", "SS3"] as const).map((cls) => {
                    const clsTopics = dbTopics.filter((t) => t.class_level === cls);
                    if (clsTopics.length === 0) return null;
                    return (
                      <div key={cls} className="mb-4">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">{cls}</h3>
                        {clsTopics.map((topic) => (
                          <div key={topic.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <div>
                              <span className="font-medium">{topic.title}</span>
                              <span className="text-xs text-muted-foreground ml-2 truncate max-w-[200px] inline-block align-middle">{topic.video_url}</span>
                            </div>
                            <div className="flex gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setEditingTopic({ ...topic })}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader><DialogTitle>Edit Topic</DialogTitle></DialogHeader>
                                  {editingTopic && editingTopic.id === topic.id && (
                                    <div className="space-y-4">
                                      <Input value={editingTopic.title} onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })} />
                                      <Textarea value={editingTopic.description} onChange={(e) => setEditingTopic({ ...editingTopic, description: e.target.value })} />
                                      <Input placeholder="Video URL" value={editingTopic.video_url} onChange={(e) => setEditingTopic({ ...editingTopic, video_url: e.target.value })} />
                                      <select
                                        className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                                        value={editingTopic.class_level}
                                        onChange={(e) => setEditingTopic({ ...editingTopic, class_level: e.target.value })}
                                      >
                                        <option value="SS1">SS1</option>
                                        <option value="SS2">SS2</option>
                                        <option value="SS3">SS3</option>
                                      </select>
                                      <DialogClose asChild>
                                        <Button onClick={handleUpdateTopic} disabled={saving} className="w-full">
                                          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                                          Save Changes
                                        </Button>
                                      </DialogClose>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteTopic(topic.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ADMINS TAB */}
          <TabsContent value="users">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">Admin Management</h2>
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Enter email to assign admin"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAssignAdmin} disabled={assignLoading}>
                    {assignLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4 mr-1" />}
                    Assign
                  </Button>
                </div>
                <div className="space-y-2">
                  {adminUsers.map((a) => (
                    <div key={a.user_id} className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="font-medium">{getUserName(a.user_id)}</span>
                        <span className="text-xs text-muted-foreground">{a.role}</span>
                      </div>
                      {a.user_id !== user?.id && (
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleRemoveAdmin(a.user_id)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ALL SCORES TAB */}
          <TabsContent value="scores">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">All Student Scores</h2>
                {scoresLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : allScores.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No scores recorded yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2">Student</th>
                          <th className="text-left py-2">Topic</th>
                          <th className="text-right py-2">Score</th>
                          <th className="text-right py-2">Total</th>
                          <th className="text-right py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allScores.map((s) => (
                          <tr key={s.id} className="border-b border-border last:border-0">
                            <td className="py-2">{getUserName(s.user_id)}</td>
                            <td className="py-2">{s.topic_id}</td>
                            <td className="py-2 text-right">{s.score}</td>
                            <td className="py-2 text-right">{s.total_questions}</td>
                            <td className="py-2 text-right text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ALL USERS TAB */}
          <TabsContent value="all-users">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">All Users ({allUsers.length})</h2>
                <div className="space-y-2">
                  {allUsers.map((u) => {
                    const isAdminUser = adminUsers.some((a) => a.user_id === u.user_id);
                    return (
                      <div key={u.user_id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{u.name || "Unnamed"}</span>
                          {isAdminUser && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Admin</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
