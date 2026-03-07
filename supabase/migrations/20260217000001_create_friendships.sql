CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

CREATE INDEX idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON public.friendships(friend_id);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can send friend requests"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can update their friendships"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their friendships"
  ON public.friendships FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.get_friends_list(target_user_id UUID)
RETURNS TABLE(
  friend_id UUID,
  username TEXT,
  email TEXT,
  total_points INTEGER,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN f.user_id = target_user_id THEN f.friend_id
      ELSE f.user_id
    END as friend_id,
    p.username,
    p.email,
    COALESCE(up.total_points, 0)::INTEGER as total_points,
    f.created_at
  FROM friendships f
  LEFT JOIN profiles p ON (
    CASE 
      WHEN f.user_id = target_user_id THEN f.friend_id
      ELSE f.user_id
    END = p.id
  )
  LEFT JOIN user_progress up ON p.id = up.user_id
  WHERE (f.user_id = target_user_id OR f.friend_id = target_user_id)
    AND f.status = 'accepted'
  ORDER BY f.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_pending_requests(target_user_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  username TEXT,
  email TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.user_id,
    p.username,
    p.email,
    f.created_at
  FROM friendships f
  LEFT JOIN profiles p ON f.user_id = p.id
  WHERE f.friend_id = target_user_id
    AND f.status = 'pending'
  ORDER BY f.created_at DESC;
END;
$$;

ALTER PUBLICATION supabase_realtime ADD TABLE friendships;
