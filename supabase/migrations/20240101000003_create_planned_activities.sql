CREATE TABLE IF NOT EXISTS planned_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  planned_date TIMESTAMP WITH TIME ZONE NOT NULL,
  planned_duration INTEGER NOT NULL,
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_planned_activities_user_id ON planned_activities(user_id);
CREATE INDEX idx_planned_activities_planned_date ON planned_activities(planned_date);

ALTER TABLE planned_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own planned activities"
  ON planned_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own planned activities"
  ON planned_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own planned activities"
  ON planned_activities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own planned activities"
  ON planned_activities FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_planned_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_planned_activities_updated_at
  BEFORE UPDATE ON planned_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_planned_activities_updated_at();

