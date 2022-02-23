import Homepage from "./Homepage.js";
import Registration from "./Registration.js";
import Login from "./Login.js";
import ResetPassword from "./ResetPassword.js";
import Footer from "./Footer.js";

import { BrowserRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="h-screen flex flex-col justify-between min-h-screen text-center justify-center pt-16">
            {/*             <h1 className="font-mono text-4xl my-8">Design meets Web</h1>
             */}{" "}
            <BrowserRouter className="grow-1">
                <Route exact path="/">
                    <Homepage />
                </Route>
                <Route exact path="/registration">
                    <Registration />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/password">
                    <ResetPassword />
                </Route>
                <Footer />
            </BrowserRouter>
        </div>
    );
}
