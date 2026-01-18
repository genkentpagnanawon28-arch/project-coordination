/*
  # Add Payment and Project Status to Cases
  
  1. New Columns
    - `payment_status` (text) - Tracks payment: paid, half paid, to be discuss
    - `project_status` (text) - Tracks project progress: not complete, on going, completed, published
    - `website_link` (text, nullable) - URL of the published website or automation link
  
  2. Changes
    - Added payment_status column with default "to be discuss"
    - Added project_status column with default "not complete"
    - Added website_link column for storing published project links
    - Added CHECK constraint for valid status values
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cases' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE cases ADD COLUMN payment_status text DEFAULT 'to be discuss' CHECK (payment_status IN ('paid', 'half paid', 'to be discuss'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cases' AND column_name = 'project_status'
  ) THEN
    ALTER TABLE cases ADD COLUMN project_status text DEFAULT 'not complete' CHECK (project_status IN ('not complete', 'on going', 'completed', 'published'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cases' AND column_name = 'website_link'
  ) THEN
    ALTER TABLE cases ADD COLUMN website_link text;
  END IF;
END $$;