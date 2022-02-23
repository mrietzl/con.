const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const bcrypt = require("bcryptjs");
const db = require("./db.js");
const cryptoRandomString = require("crypto-random-string");

// for part 10:
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

// for part 4
// configuration of multer & s3
// to upload the profile picture (file)
const multer = require("multer");
const s3 = require("./s3.js");
const uidSafe = require("uid-safe");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 4097152,
    },
});

// import the ses.js for part 3:
const ses = require("./ses.js");

// required middleware for handeling the cookie session:
const cookieSession = require("cookie-session");

// old code to access the secret keys
// const { secretKey } = require("./secrets.json");
// new code to access the secret keys (to make it available for heroku)
let secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
    secretKey = require("../secrets.json").SESSION_SECRET;
}

/* old code:
// using the  the cookie session middleware:
app.use(
    cookieSession({
        // as long as nobody know our session secret,
        // no one can tamper (change) their cookies.
        secret: secretKey,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        sameSite: true, // prevents Cross Site Request Forgery (CSRF) attacks
    })
); */

// new code: for part 10:
const cookieSessionMiddleware = cookieSession({
    secret: secretKey,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: true, // prevents Cross Site Request Forgery (CSRF) attacks
});

app.use(cookieSessionMiddleware);

// make session object available in socket connection
io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// for receiving POST form data sent by fetch (json middleware):
app.use(express.json());

app.use(compression());

// for your logo and css:
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use((req, res, next) => {
    console.log("📢", req.method, req.url, req.session);

    next();
});

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");

    next();
});

// GET route for the start page:
app.get("/user/id.json", (req, res) => {
    // TODO: read userId from session (DONE)
    // TODO: make this code work by setting up cookie-session middleware (DONE)
    console.log("req.session:", req.session);
    res.json({ userId: req.session.userId });

    // hard coded userId for testing
    // res.json({ userId: 237 });
    // res.json({ userId: undefined });
});

// POST route for registration:
app.post("/registration.json", (req, res) => {
    // req.body currently is undefined,
    // don't forget to setup json middleware (DONE)

    // this is the plaintext password
    const password = req.body.password;

    console.log(req.body);

    // TODO: fix the 'toUpperCase'
    let last = req.body.lastname.toUpperCase()[0] + req.body.lastname.slice(1); // first: 'MICHELEichele'
    let first =
        req.body.firstname.toUpperCase()[0] + req.body.firstname.slice(1); // last: 'RIETZLietzl'

    // we want to hash the password
    // before storing it in the DB.
    // NEVER EVER store the plaintext password!
    // 2 beneftis of bcrypt:
    // - designed to be slow
    // - salting built-in
    // bcrypt will automagically generate and use a random salt for every password
    // 12 is the difficulty -> the higher the slower
    bcrypt
        .hash(password, 12)
        .then((digest) => {
            // digest = hashed password
            // that's what we want to store in the database
            // e.g. : $2a$12$rXtdmRtk2L0qlZMukXseleV1fltSIoMSO9AwGMeTSnqFGG/drcbu2
            // console.log("digest:", digest);

            return db.addUser(first, last, req.body.email, digest);
        })
        .then((result) => {
            console.log(result.rows);
            req.session.userId = result.rows[0].id;
            console.log("a new user was successfully set to the bd.");
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log(
                "something went wrong during the registration process:",
                err
            );
            // the error handeling will be done in the Registration.js
            res.sendStatus(400);
        });
});

// POST route for login:
app.post("/login.json", (req, res) => {
    const email = req.body.email;

    db.getUserEmail(email).then((result) => {
        if (result.rows.length !== 0) {
            // this is the plaintext password
            const password = req.body.password;

            // we need to fetch the digest of the user
            // and compare it with the given e-mail from the db

            bcrypt
                .compare(password, result.rows[0].digest)
                .then((match) => {
                    // if match true -> store userId in session (cookie) + redirect to the welcome page
                    if (match === true) {
                        console.log(result.rows);
                        req.session.userId = result.rows[0].id;
                        console.log("the user successfully logged in.");
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(400);
                    }
                })
                // if match false -> send appropriate error message
                .catch((err) => {
                    console.log(
                        "something went wrong during the login process:",
                        err
                    );
                    // the error handeling will be done in the Login.js
                    res.sendStatus(400);
                });
        } else {
            console.log("a user with the given email does not exist.");
            // the error handeling will be done in the Login.js
            res.sendStatus(400);
        }
    });
});

// POST route for reset password:
app.post("/password/reset/start.json", (req, res) => {
    const email = req.body.email;
    console.log(req.body); // ok

    db.getUserEmail(email).then((result) => {
        // console.log(result.rows); // ok
        if (result.rows.length !== 0) {
            // to generate a new secret code we use 'cryptoRandomString' here:
            const secretCode = cryptoRandomString({
                length: 6,
            });
            // console.log(email, secretCode); // ok
            // !!! something is wrong here
            db.addSecretCode(email, secretCode)
                .then((result) => {
                    console.log(result.rows); // [ { email: 'max.mustermann@google.com', code: '32d6af' } ]
                    return ses.sendEmail(
                        result.rows[0].email,
                        "Your Verify Code",
                        "Your verify code is " +
                            result.rows[0].code +
                            ". This code expires after 10 minutes."
                    );
                    // res.sendStatus(200);
                })
                .then((result) => {
                    // console.log(result.rows);
                    console.log(
                        "a transactional mail was successfully sent to the user"
                    );
                    res.sendStatus(200);
                });
        } else {
            console.log("a user with the given email does not exist.");
            // the error handeling will be done in the Login.js
            res.sendStatus(400);
        }
    });
});

// POST route for varifying the code:
app.post("/password/reset/verify.json", (req, res) => {
    const email = req.body.email;
    const code = req.body.code;
    const password = req.body.password;

    db.getUserEmail(email).then((result) => {
        if (result.rows.length !== 0) {
            // TODO: try to find the user in the database …
            // … and get a secret code from the database for that user
            // !!! make sure that your SQL query only gets codes that are less than 10 minutes old
            // (check encounter notes to see an example SQL statement)
            db.getSecretCode(email).then((result) => {
                const bdCode = result.rows[0].code;

                // THEN: compare the secret code from the database with the secret code the user entered
                if (bdCode === code) {
                    // if they match: hash the password the user entered …
                    bcrypt
                        .hash(password, 12)
                        .then((digest) => {
                            // … update the user's password hash in the database …
                            db.updatePassword(email, digest);
                        })
                        .then((result) => {
                            // … and return a success response to the browser (step 3)
                            // console.log(result.rows);
                            console.log(
                                "the new password was successfully set to the bd."
                            );
                            res.sendStatus(200);
                        })
                        .catch((err) => {
                            console.log(
                                "something went wrong during hashing the new password",
                                err
                            );
                            // the error handeling will be done in the Registration.js
                            res.sendStatus(400);
                        });
                }
                // if they don't match, send an error response
                else {
                    console.log(
                        "the entered code does not match with the secret code from the db.",
                        result
                    );
                    // the error handeling will be done in the Login.js
                    res.sendStatus(400);
                }
            });
        } else {
            console.log("a user with the given email does not exist.");
            // the error handeling will be done in the Login.js
            res.sendStatus(400);
        }
    });
});

// GET route to receive the relevant user data for App.js:
app.get("/user.json", (req, res) => {
    console.log(
        "GET route '/user.json' from server.js was triggered. req.session is:",
        req.session
    );
    db.getUserProfile(req.session.userId).then((result) => {
        console.log("received the user data from the db:", result.rows);
        res.json(result.rows[0]);
    });
});

// POST route to handle the upload of the profile picture:
app.post("/picture.json", uploader.single("file"), s3.uploader, (req, res) => {
    console.log(req.file, req.body);
    const picture = "https://spicedling.s3.amazonaws.com/" + req.file.filename;

    db.savePicture(picture, req.session.userId).then((result) => {
        console.log(
            "the uploaded picture was successfully saved in the db:",
            result.rows
        );
        res.json(result.rows[0]);
    });
});

// POST route to handle a new bio draft:
app.post("/bio.json", (req, res) => {
    console.log(
        "the POST request '/bio.json' in server.js was triggered. 'req.body' is:",
        req.body
    );
    const newBio = req.body.bio;
    db.updateBio(newBio, req.session.userId).then((result) => {
        console.log(
            "the new bio was successfully saved in the sql file of the bd:",
            result.rows[0]
        );
        res.sendStatus(200);
    });
});

// GET route to receive the relevant user data for FindPeople.js:
app.get("/users.json", (req, res) => {
    console.log(
        "GET route '/users.json' from server.js was triggered. req.query.q is:",
        req.query.q
    );
    db.userSearch(req.query.q).then((result) => {
        console.log("received the user data from the db:", result.rows);
        res.json(result.rows);
    });
});

// GET route to receive the relevant user data for OtherProfile.js:
// IMPORTANT: we need to specify this fetch request AFTER the '/user/id.json'!
app.get("/user/:id.json", (req, res) => {
    console.log("GET route '/user/:id.json' from server.js was triggered.");
    db.getUserById(req.params.id).then((result) => {
        console.log(
            "received the data for other profile from the db:",
            result.rows[0]
        );
        if (result.rows.length !== 0) {
            res.json(result.rows[0]);
        } else {
            res.sendStatus(404);
        }
    });
});

// GET route to receive the relevant friendshipstatus for FriendBtn.js:
app.get("/friendshipstatus/:id.json", (req, res) => {
    console.log(
        "GET route '/friendshipstatus/:id.json' from server.js was triggered."
    );
    db.getFriendshipstatus(req.params.id, req.session.userId).then((result) => {
        console.log(
            "received the data for the friendshipstatus from the db:",
            result.rows[0]
        );
        // if there DOES NOT exist any row in the table 'friendships.sql' …
        // … the two users do NOT have a friendship …
        // … and we will send back the  button text 'send friend request'
        if (result.rows.length === 0) {
            console.log(
                "there DOES NOT exist any row in the table 'friendships.sql' for these two users. they do NOT have a friendship yet"
            );
            res.json("send friend request");
        }
        // if the two users DO have a friendship …
        // … we will send back the  button text 'unfriend'
        else if (result.rows[0].accepted) {
            console.log(
                "there DOES exist a row in the table 'friendships.sql' for these two users and they DO have a friendship"
            );
            res.json("unfriend");
        }
        // if the two users DO have a row in the table 'friendships.sql' …
        // … but NO friendship yet (result.rows[0].accepted === false)
        // … we nedd to check if the sender is the same as the logged in user …
        // … that means the logged-in user sent the request, …
        // … so the button text should be 'cancel friend request'
        else if (result.rows[0].sender_id === req.session.userId) {
            console.log(
                "there DOES exist a row in the table 'friendships.sql' for these two users, but they DO NOT have a friendship yet. the logged-in user has sent a request"
            );
            res.json("cancel friend request");
            // otherwise the button text should say "accept friend request".
        } else {
            console.log(
                "there DOES exist a row in the table 'friendships.sql' for these two users, but they DO NOT have a friendship yet. the logged-in user has received a request"
            );
            res.json("accept friend request");
        }
    });
});

// POST route to send a friend request from the FriendBtn.js:
app.post("/send-friend-request/:id.json", (req, res) => {
    console.log(
        "the POST request '/send-friend-request/:id.json' in server.js was triggered. 'req.body' is:",
        req.body
    );
    db.sendFriendRequest(req.params.id, req.session.userId).then(() => {
        console.log("a new friend request was successfully sent to the db");
        res.json("cancel friend request");
    });
});

// POST route to accept a friend request from the FriendBtn.js:
app.post("/accept-friend-request/:id.json", (req, res) => {
    console.log(
        "the POST request '/accept-friend-request/:id.json' in server.js was triggered. 'req.body' is:",
        req.body
    );
    db.acceptFriendRequest(req.session.userId, req.params.id).then(() => {
        console.log("the friend request was accepted");
        res.json("unfriend");
    });
});

// POST route to end a friendship or cancel a friend request from the FriendBtn.js:
app.post("/end-friendship/:id.json", (req, res) => {
    console.log(
        "the POST request '/end-friendship/:id.json' in server.js was triggered. 'req.body' is:",
        req.body
    );
    db.endFriendRequest(req.params.id, req.session.userId).then((result) => {
        console.log(
            "the friend request was cancelled or the friendship was ended"
        );
        res.json("send friend request");
    });
});

// GET route to receive the list of friends and wannabes for Friends.js:
app.get("/friends-wannabes.json", (req, res) => {
    console.log(
        "GET route '/friends-wannabes.json' from server.js was triggered."
    );
    db.getFriendsAndWannabes(req.session.userId).then((result) => {
        console.log(
            "received the data for the list of friends and wannabes from the db:",
            result.rows
        );
        res.json(result.rows);
    });
});

// POST route to log out, see nav bar in App.js:
app.post("/logout.json", (req, res) => {
    console.log(
        "the POST request '/logout.json' in server.js was triggered. 'req.session.userId' will be deleted."
    );
    req.session.userId = "";
    res.sendStatus(200);
});

io.on("connection", (socket) => {
    console.log(
        "the connection event in server.js was triggered. anew user connected. his socket.id is:",
        socket.id,
        "his session is:",
        socket.request.session
    );

    // stopping unauthenticated users from
    // getting access to our chat messages
    if (!socket.request.session.userId) {
        // 'true' prevents the client from trying to reconnect
        return socket.disconnect(true);
    }

    // TODO: send last 10 chat message to user that just connected:
    // - implement getLastChatMessages in db.js (DONE)
    // - needs to be a JOIN with the users table (DONE)
    // - think about the order of the messages (DONE)
    db.getLastChatMessages().then((result) => {
        console.log(result.rows);
        socket.emit("chatMessages", result.rows.reverse());
    });

    socket.on("chatMessage", (text) => {
        console.log(
            "chatMessage",
            text,
            "from user",
            socket.request.session.userId
        );

        // 1. store message in db with text & user id
        db.addNewMessage(socket.request.session.userId, text)
            .then(() => {
                // 2. get firstname, lastname, picture of user from db
                return db.getUser(socket.request.session.userId);
            })
            .then((result) => {
                // 3. create new message object with exact same shape
                // as the messages in your chat messages array
                console.log(result.rows[0]);
                const message = {
                    message: text,
                    first: result.rows[0].first,
                    last: result.rows[0].last,
                    picture: result.rows[0].picture,
                };
                return message;
            })
            .then((result) => {
                // 4. emit the chatMessage event to ALL clients
                // io.emit("chatMessage", message);
                io.emit("chatMessage", result);
            });
    });
});

// POST route to delete the account in Profile.js:
app.post("/delete-account.json", (req, res) => {
    console.log(
        "the POST request '/delete-account.json' in server.js was triggered. 'req.session.userId' will be deleted."
    );

    // delete uploaded picture from AWS SDK
    db.getUser(req.session.userId).then((result) => {
        const userPicture = result.rows[0].picture;
        if (userPicture) {
            s3.delete(userPicture);
        }
    });
    db.deleteMessages(req.session.userId).then(() => {
        console.log(
            "the user data were successfully deleted from the 'messages' table."
        );
        db.deleteFriendships(req.session.userId).then(() => {
            console.log(
                "the user data were successfully deleted from the 'friendships' table."
            );
            db.getUser(req.session.userId)
                .then((result) => {
                    const userEmail = result.rows[0].email;
                    return db.deleteResetCodes(userEmail);
                })
                .then(() => {
                    db.deleteUser(req.session.userId).then(() => {
                        console.log(
                            "the user data were successfully deleted from the 'users' table."
                        );
                        req.session.userId = "";
                        res.sendStatus(200);
                    });
                });
        });
    });
});

// catch-all route needs to come last
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening. You will find me on http://localhost:3000");
});
