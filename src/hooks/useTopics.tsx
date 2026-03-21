import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DbTopic {
  id: string;
  class_level: string;
  title: string;
  description: string;
  video_url: string;
  order: number;
}

export function useTopics(classLevel?: string) {
  const [topics, setTopics] = useState<DbTopic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = async () => {
    setLoading(true);
    let query = supabase.from("topics").select("*").order("order");
    if (classLevel) {
      query = query.eq("class_level", classLevel);
    }
    const { data } = await query;
    setTopics(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTopics();
  }, [classLevel]);

  return { topics, loading, refetch: fetchTopics };
}

export function useTopicById(id: string) {
  const [topic, setTopic] = useState<DbTopic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    supabase.from("topics").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setTopic(data);
      setLoading(false);
    });
  }, [id]);

  return { topic, loading };
}
