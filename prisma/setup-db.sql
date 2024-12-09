-- Disable triggers
ALTER TABLE IF EXISTS "Provider" DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS "Review" DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS "User" DISABLE TRIGGER ALL;

-- Set work_mem for better performance
SET work_mem = '256MB';

-- Set statement timeout
SET statement_timeout = '60s';