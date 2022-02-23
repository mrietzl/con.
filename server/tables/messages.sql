-- creating an SQL file with your new database schema:
-- psql -d socialnetwork -f server/tables/messages.sql

-- changes within the tables must be updated in heroku with:
-- heroku pg:psql -f server/tables/messages.sql  

-- whenever we change the sql file,
-- we need to run the psql command above again! (psql -d socialnetwork -f server/tables/messages.sql)

DROP TABLE IF EXISTS messages;

--- the id from this users table will be the field, that unifies ALL our tables
CREATE TABLE messages(
      id SERIAL PRIMARY KEY,
      sender_id INT REFERENCES users(id) NOT NULL,
      message TEXT NOT NULL CHECK (message != ''),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

-- setup for the first five messages
INSERT INTO messages (sender_id, message) 
VALUES (1, 'Hi everyone, here is Michèle 👋');

INSERT INTO messages (sender_id, message) 
VALUES (4, 'Hi Michèle 🤗 nice to meet you. My name is Adrian. Happy to chat with you 💬');

INSERT INTO messages (sender_id, message) 
VALUES (3, 'Hello from Bali 😊 my name is Susanne. Where are you from?');

INSERT INTO messages (sender_id, message) 
VALUES (4, 'Oh wow, Bali? That sounds great 🇮🇩 I am based in Austria, but soon I will move to Australia … getting some work experience there!');

INSERT INTO messages (sender_id, message) 
VALUES (1, 'Hi Susanne and Max. I am currently living in Germany … but i am not yet sure where my life journey will take me 🤍 …');


SELECT * FROM messages;