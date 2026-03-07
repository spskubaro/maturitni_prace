CREATE OR REPLACE FUNCTION public.get_leaderboard_data()
RETURNS TABLE(user_id UUID, total_points INTEGER, completed_mountains TEXT[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    up.user_id,
    COALESCE(up.total_points, 0)::INTEGER as total_points,
    COALESCE(up.completed_mountains, '{}') as completed_mountains
  FROM user_progress up
  ORDER BY COALESCE(up.total_points, 0) DESC
  LIMIT 100;
END;
$$;
