-- Fix existing scores data: divide by 10 to get raw values
UPDATE scores SET score = score / 10, total_questions = total_questions / 10 WHERE total_questions >= 10;

-- Recreate leaderboard view: accessible to all, excludes admins, top 10
DROP VIEW IF EXISTS public.leaderboard;
CREATE VIEW public.leaderboard
WITH (security_invoker = false)
AS
SELECT 
  p.name,
  sum(s.score) AS points,
  round(avg(
    CASE
      WHEN s.total_questions > 0 THEN (s.score::numeric / s.total_questions::numeric) * 100
      ELSE 0
    END
  )) AS accuracy
FROM scores s
JOIN profiles p ON p.user_id = s.user_id
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles ur WHERE ur.user_id = s.user_id AND ur.role = 'admin'
)
GROUP BY p.user_id, p.name
ORDER BY sum(s.score) DESC
LIMIT 10;