CREATE OR REPLACE FUNCTION public.get_leaderboard_period(start_ts timestamptz, end_ts timestamptz)
RETURNS TABLE(user_id UUID, total_points INTEGER, completed_mountains TEXT[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ts.user_id,
    COALESCE(SUM(ts.points), 0)::INTEGER as total_points,
    COALESCE(up.completed_mountains, '{}') as completed_mountains
  FROM time_sessions ts
  LEFT JOIN user_progress up ON up.user_id = ts.user_id
  WHERE ts.created_at >= start_ts AND ts.created_at <= end_ts
  GROUP BY ts.user_id, up.completed_mountains
  ORDER BY COALESCE(SUM(ts.points), 0) DESC
  LIMIT 100;
END;
$$;
