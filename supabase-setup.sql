-- Run this in your Supabase SQL Editor

-- 1. Create Vocabulary Table
CREATE TABLE vocabulary (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    word TEXT NOT NULL,
    meaning_ar TEXT,
    meaning_fr TEXT,
    example_sentence TEXT,
    next_review_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Test Results Table (Optional Stats)
CREATE TABLE test_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    word_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE NOT NULL,
    is_correct BOOLEAN NOT NULL,
    test_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Vocabulary (Users only see their own words)
CREATE POLICY "Users can view their own vocabulary"
ON vocabulary FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vocabulary"
ON vocabulary FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vocabulary"
ON vocabulary FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vocabulary"
ON vocabulary FOR DELETE
USING (auth.uid() = user_id);

-- 5. RLS Policies for Test Results
CREATE POLICY "Users can view their own test results"
ON test_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results"
ON test_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 6. Indexes for Performance
CREATE INDEX idx_vocabulary_user_id ON vocabulary(user_id);
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
