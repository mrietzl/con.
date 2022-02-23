-- creating an SQL file with your new database schema:
-- psql -d socialnetwork -f server/tables/reset_codes.sql

-- changes within the tables must be updated in heroku with:
-- heroku pg:psql -f server/tables/reset_codes.sql 

-- whenever we change the sql file,
-- we need to run the psql command above again! (psql -d socialnetwork -f server/tables/reset_codes.sql)

DROP TABLE IF EXISTS reset_codes;

CREATE TABLE reset_codes(
      email VARCHAR NOT NULL CHECK (email != '') REFERENCES users(email),
      code VARCHAR NOT NULL UNIQUE CHECK (code != ''),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

SELECT * FROM reset_codes;

