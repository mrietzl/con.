-- creating an SQL file with your new database schema:
-- psql -d socialnetwork -f server/tables/users_bio.sql

-- changes within the tables must be updated in heroku with:
-- heroku pg:psql -f server/tables/users_bio.sql 

-- whenever we change the sql file,
-- we need to run the psql command above again! (psql -d socialnetwork -f server/tables/users_bio.sql)

-- this is a individual sql file that add a new column to the table users.sql
-- in case we already have existing users in our social network …
-- … and do NOT want to delete them by running the main sql table (users.sql) again


ALTER TABLE users ADD COLUMN bio TEXT;

-- now we only need to run this table and it automatically add a new column to the main sql table (users.sql)
