
CREATE OR REPLACE VIEW public.leaderboard
WITH (security_invoker = true) AS
SELECT
  p.name,
  SUM(s.score) AS points,
  ROUND(AVG(CASE WHEN s.total_questions > 0 THEN (s.score::numeric / s.total_questions) * 100 ELSE 0 END)) AS accuracy
FROM public.scores s
JOIN public.profiles p ON p.user_id = s.user_id
GROUP BY p.user_id, p.name
ORDER BY points DESC;
