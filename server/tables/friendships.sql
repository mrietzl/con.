-- creating an SQL file with your new database schema:
-- psql -d socialnetwork -f server/tables/friendships.sql

-- changes within the tables must be updated in heroku with:
-- heroku pg:psql -f server/tables/friendships.sql  

-- whenever we change the sql file,
-- we need to run the psql command above again! (psql -d socialnetwork -f server/tables/friendships.sql)

DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships(
   id SERIAL PRIMARY KEY,
   sender_id INT REFERENCES users(id) NOT NULL CHECK (sender_id != receiver_id),
   receiver_id INT REFERENCES users(id) NOT NULL CHECK (receiver_id != sender_id),
   accepted BOOLEAN DEFAULT false,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

 SELECT * FROM friendships;