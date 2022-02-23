-- creating a new database for this project called socialnetwork:
-- createdb socialnetwork

-- creating an SQL file with your new database schema:
-- psql -d socialnetwork -f server/tables/users.sql

-- changes within the tables must be updated in heroku with:
-- heroku pg:psql -f server/tables/users.sql  

-- whenever we change the sql file,
-- we need to run the psql command above again! (psql -d socialnetwork -f server/tables/users.sql)

DROP TABLE IF EXISTS reset_codes;
-- DROP TABLE IF EXISTS friendships;
-- DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

--- the id from this users table will be the field, that unifies ALL our tables
CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR NOT NULL CHECK (first != ''),
      last VARCHAR NOT NULL CHECK (last != ''),
      email VARCHAR NOT NULL UNIQUE CHECK (email != ''),
      picture TEXT,
      digest VARCHAR NOT NULL CHECK (digest != ''),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      
SELECT * FROM users;