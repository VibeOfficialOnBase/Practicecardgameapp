-- Practice Card Game App Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Note: PostgreSQL 13+ includes gen_random_uuid() as a built-in function
-- No extension needed for UUID generation

-- User Profile
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by TEXT NOT NULL,
    username TEXT,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    theme TEXT DEFAULT 'light',
    onboarding_completed BOOLEAN DEFAULT false,
    streak_count INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    notification_preferences JSONB DEFAULT '{}',
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practice Cards
CREATE TABLE practice_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    difficulty TEXT,
    image_url TEXT,
    content JSONB,
    created_by TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Practice
CREATE TABLE daily_practices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    practice_date DATE DEFAULT CURRENT_DATE,
    card_id UUID REFERENCES practice_cards(id),
    completed BOOLEAN DEFAULT false,
    reflection TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by TEXT NOT NULL,
    achievement_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    earned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Cards Assignment
CREATE TABLE daily_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    card_id UUID REFERENCES practice_cards(id),
    assigned_date DATE DEFAULT CURRENT_DATE,
    opened BOOLEAN DEFAULT false,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorite Cards
CREATE TABLE favorite_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    card_id UUID REFERENCES practice_cards(id),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, card_id)
);

-- User Levels
CREATE TABLE user_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL UNIQUE,
    current_level INTEGER DEFAULT 1,
    current_xp INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Challenges
CREATE TABLE daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    challenge_text TEXT NOT NULL,
    challenge_type TEXT,
    completed BOOLEAN DEFAULT false,
    completion_date TIMESTAMP WITH TIME ZONE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Card Insights
CREATE TABLE card_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID REFERENCES practice_cards(id),
    user_email TEXT NOT NULL,
    insight_text TEXT NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Scores
CREATE TABLE game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    game_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    duration_seconds INTEGER,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Rewards
CREATE TABLE daily_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    last_claim_date DATE,
    streak_days INTEGER DEFAULT 0,
    total_rewards INTEGER DEFAULT 0,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Friends
CREATE TABLE friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    friend_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, friend_email)
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_email TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Cosmetics
CREATE TABLE user_cosmetics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    cosmetic_type TEXT NOT NULL,
    cosmetic_data JSONB DEFAULT '{}',
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Practice Sessions
CREATE TABLE daily_practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    practice_date DATE DEFAULT CURRENT_DATE,
    duration_minutes INTEGER,
    completed BOOLEAN DEFAULT false,
    score INTEGER,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Reflections
CREATE TABLE game_reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    game_type TEXT NOT NULL,
    reflection_text TEXT NOT NULL,
    mood TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom Challenges
CREATE TABLE custom_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_email TEXT,
    status TEXT DEFAULT 'active',
    difficulty TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Friend Streaks
CREATE TABLE friend_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    friend_email TEXT NOT NULL,
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    badge_type TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    earned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chakra Achievements
CREATE TABLE chakra_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    chakra_type TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Challenges
CREATE TABLE community_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    goal_target INTEGER,
    current_progress INTEGER DEFAULT 0,
    created_by TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge Participants
CREATE TABLE challenge_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES community_challenges(id),
    user_email TEXT NOT NULL,
    contribution INTEGER DEFAULT 0,
    joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_by TEXT NOT NULL,
    avatar_url TEXT,
    member_count INTEGER DEFAULT 1,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group Members
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id),
    user_email TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_email)
);

-- Social Posts
CREATE TABLE social_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by TEXT NOT NULL,
    content TEXT NOT NULL,
    post_type TEXT DEFAULT 'status',
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post Comments
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES social_posts(id),
    created_by TEXT NOT NULL,
    content TEXT NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post Likes
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES social_posts(id),
    user_email TEXT NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_email)
);

-- Vibeagotchi State
CREATE TABLE vibeagotchi_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL UNIQUE,
    name TEXT,
    level INTEGER DEFAULT 1,
    happiness INTEGER DEFAULT 50,
    energy INTEGER DEFAULT 50,
    health INTEGER DEFAULT 100,
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vibeagotchi Evolution
CREATE TABLE vibeagotchi_evolutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    evolution_stage TEXT NOT NULL,
    unlocked_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Queue
CREATE TABLE notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    title TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Pulse
CREATE TABLE activity_pulses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional tables from entities
CREATE TABLE bonus_pulls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    pull_count INTEGER DEFAULT 0,
    last_pull_date TIMESTAMP WITH TIME ZONE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE buddy_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    buddy_email TEXT NOT NULL,
    connection_strength INTEGER DEFAULT 0,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE personalized_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    recommendation_text TEXT NOT NULL,
    recommendation_type TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE streak_protections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    protection_count INTEGER DEFAULT 0,
    last_used_date TIMESTAMP WITH TIME ZONE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL UNIQUE,
    preferences JSONB DEFAULT '{}',
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE endorsements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user TEXT NOT NULL,
    to_user TEXT NOT NULL,
    endorsement_type TEXT,
    message TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE challenge_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    challenge_id UUID,
    points INTEGER DEFAULT 0,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE game_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_name TEXT NOT NULL,
    description TEXT,
    target_score INTEGER,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE global_progressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    progression_type TEXT NOT NULL,
    current_value INTEGER DEFAULT 0,
    target_value INTEGER,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE friend_gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user TEXT NOT NULL,
    to_user TEXT NOT NULL,
    gift_type TEXT NOT NULL,
    gift_data JSONB DEFAULT '{}',
    claimed BOOLEAN DEFAULT false,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE unlocked_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    content_type TEXT NOT NULL,
    content_id TEXT NOT NULL,
    unlocked_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    recommendation_text TEXT NOT NULL,
    category TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE generated_affirmations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    affirmation_text TEXT NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE personalized_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    challenge_text TEXT NOT NULL,
    difficulty TEXT,
    status TEXT DEFAULT 'active',
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE game_masteries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    game_type TEXT NOT NULL,
    mastery_level INTEGER DEFAULT 1,
    total_plays INTEGER DEFAULT 0,
    best_score INTEGER,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE weekly_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_text TEXT NOT NULL,
    challenge_type TEXT,
    week_start_date DATE,
    week_end_date DATE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE weekly_challenge_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    challenge_id UUID REFERENCES weekly_challenges(id),
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_user_profiles_created_by ON user_profiles(created_by);
CREATE INDEX idx_daily_practices_user_email ON daily_practices(user_email);
CREATE INDEX idx_daily_practices_date ON daily_practices(practice_date);
CREATE INDEX idx_achievements_created_by ON achievements(created_by);
CREATE INDEX idx_community_posts_created_by ON community_posts(created_by);
CREATE INDEX idx_daily_cards_user_email ON daily_cards(user_email);
CREATE INDEX idx_favorite_cards_user_email ON favorite_cards(user_email);
CREATE INDEX idx_game_scores_user_email ON game_scores(user_email);
CREATE INDEX idx_game_scores_type ON game_scores(game_type);
CREATE INDEX idx_friends_user_email ON friends(user_email);
CREATE INDEX idx_messages_recipient ON messages(recipient_email);
CREATE INDEX idx_messages_sender ON messages(sender_email);
CREATE INDEX idx_notification_queue_user ON notification_queue(user_email);
CREATE INDEX idx_activity_pulses_date ON activity_pulses(created_date DESC);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE chakra_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibeagotchi_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibeagotchi_evolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_pulses ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (authenticated users can read/write their own data)
-- Note: Adjust these policies based on your specific security requirements

-- Example policy for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid()::text = created_by);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid()::text = created_by);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = created_by);

-- Add similar policies for other tables as needed
-- For public content like community_posts, you might want:
CREATE POLICY "Anyone can view community posts" ON community_posts
    FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update their own posts" ON community_posts
    FOR UPDATE USING (auth.uid()::text = created_by);
