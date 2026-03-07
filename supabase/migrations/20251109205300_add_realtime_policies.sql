CREATE POLICY "Anyone can view user_progress for leaderboard"
  ON public.user_progress FOR SELECT
  USING (true);
