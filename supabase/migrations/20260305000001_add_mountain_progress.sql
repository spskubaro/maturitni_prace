
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS mountain_progress JSONB DEFAULT '{}';

UPDATE public.user_progress
SET mountain_progress = '{}'
WHERE mountain_progress IS NULL;
