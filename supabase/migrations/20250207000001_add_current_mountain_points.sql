
ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS current_mountain_points INTEGER DEFAULT 0;

UPDATE public.user_progress 
SET current_mountain_points = 0 
WHERE current_mountain_points IS NULL;
