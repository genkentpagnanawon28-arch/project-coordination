/*
  # MoshiTech Case Manager - Database Schema
  
  1. New Tables
    - `cases`
      - `id` (uuid, primary key) - Unique identifier for each case
      - `client_name` (text) - Name of the client
      - `case_name` (text, unique) - Unique name for the case/project
      - `website_type` (text) - Type of website (Portfolio, Store, Corporate, etc.)
      - `package` (text) - Package tier (Beginner, Elite, Business)
      - `priority` (text) - Priority level (LOW, MID, HIGH)
      - `start_date` (date) - Project start date
      - `end_date` (date, nullable) - Optional project end date
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp
  
  2. Security
    - Enable RLS on `cases` table
    - Add policy for public access (since we're using passcode-based auth at app level)
    
  3. Indexes
    - Index on priority for efficient sorting
    - Index on case_name for search functionality
*/

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  case_name text UNIQUE NOT NULL,
  website_type text NOT NULL,
  package text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('LOW', 'MID', 'HIGH')),
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (app-level passcode protection)
CREATE POLICY "Allow all operations for public access"
  ON cases
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cases_priority ON cases(priority);
CREATE INDEX IF NOT EXISTS idx_cases_case_name ON cases(case_name);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_cases_updated_at ON cases;
CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();