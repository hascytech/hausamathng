
CREATE TABLE public.topics (
  id text PRIMARY KEY,
  class_level text NOT NULL CHECK (class_level IN ('SS1', 'SS2', 'SS3')),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  "order" integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Everyone can read topics
CREATE POLICY "Anyone can view topics" ON public.topics FOR SELECT USING (true);

-- Admins can manage topics
CREATE POLICY "Admins can insert topics" ON public.topics FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update topics" ON public.topics FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete topics" ON public.topics FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Seed with existing topics
INSERT INTO public.topics (id, class_level, title, description, video_url, "order") VALUES
  ('linear-equations', 'SS1', 'Linear Equations', 'Learn how to solve linear equations. In this lesson, we''ll find the value of x in equations.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1),
  ('indices', 'SS1', 'Indices', 'Learn the laws of indices and how to apply them to solve problems. We''ll cover adding, subtracting, and multiplying indices.', 'https://www.youtube.com/watch?v=ysz5S6PUM-U', 2),
  ('quadratic-expressions', 'SS1', 'Quadratic Expressions', 'Understand quadratic expressions and how to factorize them. We''ll learn how to use formulas to solve problems.', 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', 3),
  ('trigonometry', 'SS2', 'Trigonometry', 'Learn sine, cosine, and tangent. We''ll use them to calculate angles and sides of triangles.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1),
  ('logarithms', 'SS2', 'Logarithms', 'Understand logarithms and their laws. We''ll learn how to use logarithm tables and calculators.', 'https://www.youtube.com/watch?v=ysz5S6PUM-U', 2),
  ('surds', 'SS2', 'Surds', 'Learn how to simplify surds and rationalize the denominator. We''ll practice arithmetic operations with surds.', 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', 3),
  ('differentiation', 'SS3', 'Differentiation', 'Learn how to find the derivative of a function. We''ll cover differentiation rules and their applications.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1),
  ('integration', 'SS3', 'Integration', 'Understand integration as the reverse of differentiation. We''ll learn how to integrate various functions.', 'https://www.youtube.com/watch?v=ysz5S6PUM-U', 2),
  ('probability', 'SS3', 'Probability', 'Learn how to calculate the likelihood of events. We''ll cover probability rules and their applications.', 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', 3);
