import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topicId, topicTitle, topicDescription, classLevel, regenerate } = await req.json();

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

    // If regenerate, delete existing questions first
    if (regenerate) {
      const { error: delError } = await supabase
        .from("quiz_questions")
        .delete()
        .eq("topic_id", topicId);
      if (delError) throw delError;
    } else {
      // Check if questions already exist
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
    }

    // Build scope guidance from the topic description
    const scopeGuidance = topicDescription
      ? `\n\nIMPORTANT SCOPE: The topic description is "${topicDescription}". Use this as guidance for what aspects to cover. Only ask questions about concepts mentioned or closely related to this description. Do NOT ask questions about aspects of "${topicTitle}" that are outside the scope described.`
      : "";

    const prompt = `Quiz me on ${topicTitle} for ${classLevel || "Senior Secondary"} level mathematics.${scopeGuidance}

Generate exactly 30 multiple-choice questions with mixed difficulty (about 10 easy, 10 medium, 10 hard).

CRITICAL — QUESTION INDEPENDENCE:
Each question MUST be fully self-contained and independent. Questions are served in random order, so a question must NEVER refer to:
- "the previous question", "the question above", "the matrix from question 2", "using the value of x found earlier", etc.
- any data, variable, equation, matrix, or result defined in another question.
If a question needs a matrix, equation, function, or dataset, restate it IN FULL inside that question itself.

CRITICAL — LaTeX MATH FORMATTING:
All mathematical expressions MUST be written in LaTeX and wrapped in delimiters:
- Inline math: use single dollar signs, e.g. $x^2 + 3x - 4 = 0$, $\\sqrt{2}$, $\\frac{a}{b}$
- Block / display math (for matrices, large fractions, integrals, square/cube roots, summations, vertical layouts): use double dollar signs, e.g. $$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$$, $$\\sqrt[3]{27}$$, $$\\int_0^1 x^2 \\, dx$$
- Use proper LaTeX commands: \\frac{}{}, \\sqrt{}, \\sqrt[3]{}, \\sum, \\int, \\begin{pmatrix}...\\end{pmatrix}, \\begin{bmatrix}...\\end{bmatrix}, ^{}, _{}, \\cdot, \\times, \\div, \\pi, \\theta, \\Delta, \\le, \\ge, \\ne, \\approx
- Apply LaTeX in the question text, in EVERY option value, in step-by-step solutions, and in the explanation.
- Do NOT use plain text like "x^2" or "sqrt(2)" or "1/2" — always wrap in $...$ or $$...$$.
- For matrices, vertical vectors, cube roots, nth roots, and stacked fractions, prefer block math ($$...$$) so they render in normal vertical form.

JSON output format (return a JSON array only):
[
  {
    "question": "the question text with LaTeX math in $...$ or $$...$$",
    "options": [
      {"label": "A", "value": "option text with LaTeX where needed"},
      {"label": "B", "value": "option text with LaTeX where needed"},
      {"label": "C", "value": "option text with LaTeX where needed"},
      {"label": "D", "value": "option text with LaTeX where needed"}
    ],
    "correctAnswer": "the value of the correct option (must match one of the option values EXACTLY, including LaTeX)",
    "stepByStep": ["step 1 with LaTeX", "step 2 with LaTeX", "step 3 with LaTeX"],
    "explanation": "brief explanation with LaTeX",
    "difficulty": "easy" | "medium" | "hard"
  }
]

IMPORTANT:
- correctAnswer must exactly match one of the option values (character-for-character, including LaTeX delimiters).
- Questions should be appropriate for Nigerian Senior Secondary School level.
- Include calculations, word problems, and conceptual questions.
- Each question stands alone — assume the student has seen no other question.
- Return ONLY the JSON array, no markdown fences, no other text.
- In JSON strings, every backslash in LaTeX must be escaped as \\\\ (e.g. "$\\\\frac{1}{2}$").`;

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

    let questions;
    try {
      let cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      // Fix malformed JSON: duplicate "label" keys where "value" was intended
      // Pattern: {"label": "X", "label": "some text"} -> {"label": "X", "value": "some text"}
      cleaned = cleaned.replace(/"label":\s*"([A-D])"\s*,\s*"label":\s*"/g, '"label": "$1", "value": "');
      questions = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse quiz questions from AI");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("AI did not return a valid array of questions");
    }

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
