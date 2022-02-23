const spicedPg = require("spiced-pg");

// old code to access the secret keys
// progress_ YOUR_USERNAME:YOUR_PASSWORD@LOCALHOST:5432/DB_NAME
// const { connectionString } = require("./secrets.json");

// access the secret keys (to make it available for heroku – for later)
let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    connectionString = require("../secrets.json").connectionString;
}

const db = spicedPg(connectionString);

// the function to add a new user
module.exports.getUser = (userId) => {
    return db.query(`SELECT * FROM users WHERE id = $1;`, [userId]);
};

module.exports.addUser = (first, last, email, digest) => {
    return db.query(
        `INSERT INTO users (first, last, email, digest) 
        VALUES ($1, $2, $3, $4)
        RETURNING id;`,
        [first, last, email, digest]
    );
};

module.exports.getUserEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
};

module.exports.addSecretCode = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes (email, code) 
        VALUES ($1, $2)
        RETURNING *;`,
        [email, code]
    );
};

module.exports.getSecretCode = (email) => {
    return db.query(
        `SELECT * FROM reset_codes WHERE email = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' ORDER BY created_at DESC;`,
        [email]
    );
};

module.exports.updatePassword = (email, digest) => {
    return db.query(
        `UPDATE users SET digest=$2
        WHERE email = $1;`,
        [email, digest]
    );
};

// the function for part 4
// to get only the relevant information (security reasons!)
// for the GET request '/app/get/user.json' in server.js and App.js
module.exports.getUserProfile = (userId) => {
    return db.query(
        `SELECT id, first, last, email, picture, bio FROM users WHERE id = $1;`,
        [userId]
    );
};

// another function for part 4
// to save the uploaded profile picture in the users.sql table
// we got from the POST request '/picture.json' in server.js and Uploader.js
module.exports.savePicture = (picture, userId) => {
    return db.query(
        `UPDATE users SET picture=$1
        WHERE id = $2
        RETURNING picture;`,
        [picture, userId]
    );
};

// db querry for part 5
// to save the new bio draft in the users_bio.sql table
// we got from the POST request '/bio.json' in server.js and BioEditor.js
module.exports.updateBio = (bio, userId) => {
    return db.query(
        `UPDATE users SET bio=$1
        WHERE id = $2
        RETURNING bio;`,
        [bio, userId]
    );
};

// db querry for part 6
// to search for users
module.exports.userSearch = (val) => {
    return db.query(
        `SELECT id, first, last, picture FROM users
        WHERE CONCAT (first,' ', last) ILIKE $1 ORDER BY last ASC LIMIT 4;`,
        ["%" + val + "%"]
    );
};

// db querry for part 7
// to get other user profile
module.exports.getUserById = (id) => {
    return db.query(
        `SELECT id, first, last, picture, bio FROM users
        WHERE id = $1`,
        [id]
    );
};

// db querry for part 8
// to get the Friendshipsstatus or the FriendButton (GET request)
module.exports.getFriendshipstatus = (receiverId, senderId) => {
    return db.query(
        `SELECT * FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);`,
        [receiverId, senderId]
    );
};

// db querry for part 8
// to send a friend request (POST request)
module.exports.sendFriendRequest = (receiverId, senderId) => {
    return db.query(
        `INSERT INTO friendships (receiver_id, sender_id) 
        VALUES ($1, $2);`,
        [receiverId, senderId]
    );
};

// db querry for part 8
// to accept a friend request (POST request)
module.exports.acceptFriendRequest = (receiverId, senderId) => {
    return db.query(
        `UPDATE friendships SET accepted=true
        WHERE receiver_id = $1 AND sender_id = $2;`,
        [receiverId, senderId]
    );
};

// db querry for part 8
// to end a friend request (POST request)
module.exports.endFriendRequest = (receiverId, senderId) => {
    return db.query(
        `DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);`,
        [receiverId, senderId]
    );
};

// db querry for part 9
// to retrieve the list of friends and wannabes from the db …
// … and send it back to the client (GET request)
// first line: WANNABES
// second line: Friend requests, that I accepted
// third line: Friend requests, that the other person accepted
module.exports.getFriendsAndWannabes = (userId) => {
    return db.query(
        `SELECT * FROM friendships
		JOIN users
        ON (sender_id=users.id AND receiver_id=$1 AND accepted=false)
        OR (sender_id=users.id AND receiver_id=$1 AND accepted=true)
        OR (sender_id=$1 AND receiver_id=users.id AND accepted=true);`,
        [userId]
    );
};

// db querrys for part 10:
// to get the ten most recent messages …
module.exports.getLastChatMessages = () => {
    return db.query(
        `SELECT messages.message, messages.sender_id, users.first, users.last, users.picture FROM messages
		JOIN users
        ON (messages.sender_id=users.id) ORDER BY messages.created_at DESC;`,
        []
    );
};

// … and to add new message when one is received from a client
module.exports.addNewMessage = (userId, message) => {
    return db.query(
        `INSERT INTO messages (sender_id, message) 
        VALUES ($1, $2);`,
        [userId, message]
    );
};

// db querry to delete the account (no.1 of 4)
module.exports.deleteMessages = (userId) => {
    return db.query(
        `DELETE FROM messages
        WHERE sender_id = $1;`,
        [userId]
    );
};

// db querry to delete the account (no.2 of 4)
module.exports.deleteFriendships = (userId) => {
    return db.query(
        `DELETE FROM friendships
        WHERE sender_id = $1 OR receiver_id = $1;`,
        [userId]
    );
};

// db querry to delete the account (no.3 of 4)
module.exports.deleteResetCodes = (email) => {
    return db.query(
        `DELETE FROM reset_codes
        WHERE email = $1;`,
        [email]
    );
};

// db querry to delete the account (no.3 of 4)
module.exports.deleteUser = (userId) => {
    return db.query(
        `DELETE FROM users
        WHERE id = $1;`,
        [userId]
    );
};
