-- Initialize database settings
SET work_mem = '256MB';
SET statement_timeout = '60s';
SET idle_in_transaction_session_timeout = '30s';
ALTER SYSTEM SET max_prepared_transactions = 150;