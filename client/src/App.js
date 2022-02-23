import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import Chat from "./Chat.js";
import Profile from "./Profile.js";
import ProfilePicture from "./ProfilePicture.js";
import Uploader from "./Uploader.js";
import FindPeople from "./FindPeople.js";
import OtherProfile from "./OtherProfile.js";
import Friends from "./Friends.js";
import Footer from "./Footer.js";

// App.js as high level component
// needs to be a class component because we want to store the information about the user in a state object
export default class App extends Component {
    constructor(props) {
        super(props);

        // this is the central place, where we want to store all information about the logged in user
        this.state = {
            id: "",
            firstname: "",
            lastname: "",
            email: "",
            picture: "",
            uploaderVisible: false,
            bio: "",
        };

        this.toggleUploader = this.toggleUploader.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.update = this.update.bind(this);
    }

    // lifecycle method
    componentDidMount() {
        console.log("lifecycle method from App.js just mounted");

        // fetch request to get user info from server
        // and then setState …
        fetch("/user.json")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(
                    "received the user data for lifecycle method in 'App.js' from db:",
                    data
                );

                this.setState({
                    id: data.id,
                    firstname: data.first,
                    lastname: data.last,
                    email: data.email,
                    picture: data.picture,
                    bio: data.bio,
                    uploaderVisible: false,
                });
            });
    }

    toggleUploader() {
        this.setState({ uploaderVisible: !this.state.uploaderVisible });
    }

    uploadImage(file) {
        console.log(
            "uploadImage function in the 'App.js' is triggered. the state of the App component is:",
            this.state,
            "the file is:",
            file
        );
        this.setState({ picture: file });
        this.setState({ uploaderVisible: false });
    }

    // update function for BioEditor in the Profile.js
    update(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    logoutHover(evt) {
        evt.target.src = "/social-network_icon-logout-hover.svg";
    }

    logoutUnhover(evt) {
        evt.target.src = "/social-network_icon-logout.svg";
    }

    usersHover(evt) {
        evt.target.src = "/social-network_icon-users-hover.svg";
    }

    usersUnhover(evt) {
        evt.target.src = "/social-network_icon-users.svg";
    }

    chatHover(evt) {
        evt.target.src = "/social-network_icon-chat-hover.svg";
    }

    chatUnhover(evt) {
        evt.target.src = "/social-network_icon-chat.svg";
    }

    logout() {
        console.log("logout button was clicked.");

        fetch(`/logout.json`, {
            method: "POST",
        }).then((res) => {
            if (res.ok) {
                // status code in 200 range:
                // user succesfully logged in
                // reload page to trigger start.js
                // -> to show user logged-in component
                location.href = "/login";
            }
        });
    }

    // clickEvent to change the color mode
    handleDark() {
        if (document.querySelector("html").classList.contains("dark")) {
            // document.querySelector("html").classList = "dark";
            document.querySelector("html").classList.remove("dark");
            document.querySelector("#toggle-circle").classList.remove("dark");
        } else {
            document.querySelector("html").classList.add("dark");
            document.querySelector("#toggle-circle").classList.add("dark");
        }
    }

    render() {
        if (!this.state.id) {
            return <p>Loading...</p>;
        }
        return (
            <div className="h-screen flex flex-col justify-between min-h-screen">
                <BrowserRouter className="grow-1">
                    <div className="relative px-8">
                        <div className="flex border-b border-[#F2F2F2] py-4">
                            <Link to="/">
                                <img
                                    className="mr-8 ml-8 h-20"
                                    src="/social-network_logo.svg"
                                />
                            </Link>

                            <div className="w-full flex items-center justify-end mr-8 ml-8 h-20">
                                <p className="font-mono text-xs leading-6 mr-8 text-[#F2F2F2] hover:text-[#D7F205] hover:cursor-zoom-in">
                                    <Link
                                        to="/users"
                                        className="hover:cursor-zoom-in"
                                    >
                                        Find friends
                                    </Link>
                                </p>

                                <button
                                    type="button"
                                    className="mr-8 bg-[#021A25] relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-[#F2F2F2] rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D7F205] hover:cursor-ew-resize dark:bg-[#BF046B]"
                                    role="switch"
                                    aria-checked="false"
                                    onClick={this.handleDark}
                                >
                                    <span className="sr-only"></span>
                                    <span
                                        id="toggle-circle"
                                        aria-hidden="true"
                                        className="translate-x-0 dark:translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-[#D7F205] shadow transform ring-0 transition ease-in-out duration-200"
                                    ></span>
                                </button>

                                <ProfilePicture
                                    className="h-16 w-16 object-cover hover:cursor-copy"
                                    picture={this.state.picture}
                                    firstname={this.state.firstname}
                                    lastname={this.state.lastname}
                                    toggleUploader={this.toggleUploader}
                                />

                                <Link to="/friends-wannabes">
                                    <img
                                        className="ml-8"
                                        src="/social-network_icon-users.svg"
                                        onMouseEnter={this.usersHover}
                                        onMouseLeave={this.usersUnhover}
                                    />
                                </Link>

                                <Link to="/chat">
                                    <img
                                        className="ml-8 hover:cursor-context-menu hover:cursor-context-menu"
                                        src="/social-network_icon-chat.svg"
                                        onMouseEnter={this.chatHover}
                                        onMouseLeave={this.chatUnhover}
                                    />
                                </Link>

                                <img
                                    className="ml-8 hover:cursor-alias"
                                    src="/social-network_icon-logout.svg"
                                    onMouseEnter={this.logoutHover}
                                    onMouseLeave={this.logoutUnhover}
                                    onClick={this.logout}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-screen grid text-center justify-center pt-32 text-[#F2F2F2]">
                        <Route exact path="/">
                            <div>
                                <p className="font-mono text-xs leading-6 text-[#F2F2F2]">
                                    Your current Email is:
                                </p>
                                <p className="mb-4 italic">
                                    {this.state.email}
                                </p>
                                <Profile
                                    picture={this.state.picture}
                                    firstname={this.state.firstname}
                                    lastname={this.state.lastname}
                                    bio={this.state.bio}
                                    toggleUploader={this.toggleUploader}
                                    update={this.update}
                                />
                            </div>
                        </Route>

                        {this.state.uploaderVisible && (
                            <Uploader
                                uploadImage={this.uploadImage}
                                toggleUploader={this.toggleUploader}
                            />
                        )}

                        <Route path="/users">
                            <FindPeople />
                        </Route>

                        <Route path="/user/:id">
                            <OtherProfile id={this.state.id} />
                        </Route>

                        <Route path="/chat">
                            <Chat />
                        </Route>

                        <Route path="/friends-wannabes">
                            <Friends />
                        </Route>
                    </div>
                    <Footer />
                </BrowserRouter>
            </div>
        );
    }
}
