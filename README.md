# con. – a social network project

This project is a meeting platform for designer and web developer. People can create their own account, login or logout and edit their profile by uploading an picture or editing the bio. They can also delete their profile again or set a new password. Additionally other profiles can be viewed, users can search for friends send friendship requests to each other or chat together. The social network has it's own branding with a logo, a color scheme and the posibility to change between two color modi by a toggle bar. The logo within the tab bar adapts to the respective light/dark mode of the browser.

Check out the 👉 [social network](https://social-network-con.herokuapp.com/)

The project was made at the [SPICED Academy](https://www.spiced-academy.com/de) within my Full Stack Web Development Bootcamp (Nov. '21 to Feb. '22)

---

## Features

-   single page application (SPA)
-   client-site routing with react-router
-   conditional rendering for error handeling
-   registration for new users with firstname, lastname, email and password
-   password hashing with bcrypt protection; the input is displayed encrypted
-   use of functional components and class components
-   reset password flow
-   login and logout for registrated users
-   profile component to show name and mail, add and edit a profile picture and bio
-   incremental search to find people
-   using Hooks as react feature for functional components
-   friendship button to send, accept and cancel a friend request or end the friendship again
-   overview over all the personal friends and potential friends with the option to accept open requests or unfriend again
-   community-wide chat room powered by socket.io
-   delete the account and all related data from the data base
-   toogle bar to change between two color modi
-   individual branding with logo, icons and color scheme
-   different cursor styles when hovering over an element
-   using tailwindcss for styling
<!-- - user acceptance testing with jest -->

<!-- … (more to add) -->

---

## Technology

<a href="https://aws.amazon.com/" > <img src="/client/public/technologies/web-development-aws.png" height="75px" /></a>
<a href="https://babeljs.io/" > <img src="/client/public/technologies/web-development-babel.png" height="75px" /></a>
<a href="https://developer.mozilla.org/en-US/docs/Web/CSS" > <img src="/client/public/technologies/web-development-css-3.png" height="75px" /></a>
<a href="https://www.w3schools.com/js/js_es6.asp" > <img src="/client/public/technologies/web-development-es6.png" height="75px" /></a>
<a href="http://expressjs.com/" > <img src="/client/public/technologies/web-development-express.png" height="75px" /></a>
<a href="https://developer.mozilla.org/en-US/docs/Glossary/HTML5" > <img src="/client/public/technologies/web-development-html-5.png" height="75px" /></a>
<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP" > <img src="/client/public/technologies/web-development-http.png" height="75px" /></a>
<a href="https://tc39.es/ecma262/" > <img src="/client/public/technologies/web-development-js.png" height="75px" /></a>
<a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON" > <img src="/client/public/technologies/web-development-json.png" height="75px" /></a>
<a href="https://nodejs.org/en/" > <img src="/client/public/technologies/web-development-node-js.png" height="75px" /></a>
<a href="https://www.postgresql.org/" > <img src="/client/public/technologies/web-development-PostgreSQL.png" height="75px" /></a>
<a href="https://reactjs.org/" > <img src="/client/public/technologies/web-development-react.png" height="75px" /></a>
<a href="https://redux.js.org/" > <img src="/client/public/technologies/web-development-redux.png" height="75px" /></a>
<a href="https://socket.io/" > <img src="/client/public/technologies/web-development-socket-io.png" height="75px" /></a>
<img src="/client/public/technologies/web-development-sql.png" height="75px" />
<a href="https://tailwindcss.com//" > <img src="/client/public/technologies/web-development-tailwindcss.png" height="75px" /></a>
<a href="https://code.visualstudio.com/" > <img src="/client/public/technologies/web-development-visual-studio-code.png" height="75px" /></a>
<a href="https://webpack.js.org/" > <img src="/client/public/technologies/web-development-webpack.png" height="75px" /></a>

<!--  classify the into frontend and backend technologies ?? -->

---

<!-- ## Design library -->

<!-- ## Preview -->

## Screens

### Color Scheme

The user can switch between two color scheme which can be set by clicking on the toggle bar.

![color scheme](/client/public/screens/color-scheme.png)

### Start Screen

The first screen when you visit the start page of con.

![start screen](/client/public/screens/start.png)

### Registration Screen

Registration page to create a new account.

![registration screen](/client/public/screens/registration.png)

### Login Screen

Login page for users who already have an existing account. Here you can also see the error handeling when something went wrong during the login process, e.g. if the user did not fill out the mandatory fields.

![login screen](/client/public/screens/login.png)

### Reset Password Screen

When people have forgotten their password they can reset it with a secured process in three steps.

![reset password screen](/client/public/screens/reset-password.png)

### Profile Screen

Individual profil page where users can upload an image, edit their bio or delete the account.

![profile screen](/client/public/screens/profile.png)

### Users Screen

With an incremental search users can search for friends or other people.

![users screen](/client/public/screens/users-1.png)

### 404 Screen

When a user does not exist a 404 page will appear.

![404 screen](/client/public/screens/404.png)

### Chat Screen

The open meeting room can be used to chat with each other.

![chat screen](/client/public/screens/chat.png)

---

**© 2022, Michèle Rietzl**

<!--

High Level Description:
…

Website:
…

Tags:
- aws
- aws-s3
- aws-ses
- components
- css
- design
- fetch
- heroku
- html
- js
- node-js
- pagination
- postresql
- react
- s3-bucket
- spicedacademy

-->
