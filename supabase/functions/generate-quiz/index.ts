import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topicId, topicTitle, classLevel } = await req.json();

    if (!topicId || !topicTitle) {
      return new Response(JSON.stringify({ error: "topicId and topicTitle are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if questions already exist for this topic
    const { data: existing, error: checkError } = await supabase
      .from("quiz_questions")
      .select("id")
      .eq("topic_id", topicId)
      .limit(1);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({ message: "Questions already exist", generated: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate questions using Lovable AI
    const prompt = `Quiz me on ${topicTitle} for ${classLevel || "Senior Secondary"} level mathematics.

Generate exactly 25 multiple-choice questions with mixed difficulty (about 8 easy, 9 medium, 8 hard).

Return a JSON array of objects with this exact structure:
[
  {
    "question": "the question text",
    "options": [
      {"label": "A", "value": "option text"},
      {"label": "B", "value": "option text"},
      {"label": "C", "value": "option text"},
      {"label": "D", "value": "option text"}
    ],
    "correctAnswer": "the value of the correct option (must match one of the option values exactly)",
    "stepByStep": ["step 1", "step 2", "step 3"],
    "explanation": "brief explanation of the solution",
    "difficulty": "easy" | "medium" | "hard"
  }
]

IMPORTANT:
- correctAnswer must exactly match one of the option values
- Questions should be appropriate for Nigerian Senior Secondary School level
- Include calculations, word problems, and conceptual questions
- Return ONLY the JSON array, no other text`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are QuizGPT, an expert mathematics quiz generator. You generate high-quality multiple-choice questions. Always respond with valid JSON only, no markdown fences.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content from AI");

    // Parse JSON from response (handle potential markdown fences)
    let questions;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      questions = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse quiz questions from AI");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("AI did not return a valid array of questions");
    }

    // Insert questions into database
    const rows = questions.map((q: any) => ({
      topic_id: topicId,
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      step_by_step: q.stepByStep,
      explanation: q.explanation,
      difficulty: q.difficulty || "medium",
    }));

    const { error: insertError } = await supabase.from("quiz_questions").insert(rows);
    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ message: "Questions generated", generated: true, count: rows.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-quiz error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
