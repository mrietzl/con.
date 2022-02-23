import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { Link } from "react-router-dom";

import FriendBtn from "./FriendBtn.js";

export default function OtherProfile(props) {
    const { id } = useParams(); // url params
    const history = useHistory();
    const userId = props.id;

    // state for storing user info with useState
    // other possibility with more definitions:
    /* const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [picture, setPicture] = useState("");
    const [bio, setBio] = useState(""); */
    const [error, setError] = useState(false);

    const [user, setUser] = useState({});

    // console.log("OtherProfile with id", id);
    // console.log("history", history);
    // console.log("userId is", userId);

    useEffect(() => {
        // fetch request to get info about user with id.
        fetch(`/user/${id}.json`)
            // then store it in state.
            .then((res) => {
                if (res.ok) {
                    // console.log("id is", id, "and", userId);
                    // handle edge cases no.1:
                    // 2. user seeing their own profile as "OtherProfile"
                    // -> redirect user to "/"
                    // for doing the redirect we can work with history.replace("/")
                    if (userId == id) {
                        history.replace("/");
                    } else {
                        return res.json();
                    }
                } else {
                    // handle edge cases no.2:
                    // 1. user not found (404 status code) -> show error message
                    setError(true);
                    document.title = "not found";
                    document.querySelector("#light").href =
                        "/social-network_favicon-404-lightscheme.png";
                    document.querySelector("#dark").href =
                        "/social-network_favicon-404-darkscheme.png";
                }
            })
            .then((res) => {
                if (res) {
                    setUser(res);
                }
            });
    }, [id, userId]);

    if (!error) {
        return (
            <div className="flex flex-col gap-y-4">
                <div className="flex justify-center mt-4 mb-4">
                    <img
                        className={`h-32 w-32 object-cover mt-2 mb-2 flex grid self-center ${
                            user.className
                        } ${
                            user.picture
                                ? "rounded-lg border-2 border-[#F2F2F2]"
                                : ""
                        }`}
                        src={
                            user.picture || "/default-icon-profile-picture.svg"
                        }
                        alt={`${user.first} ${user.last}`}
                    />
                </div>

                <p className="font-mono text-[#D7F205]">
                    {user.first} {user.last}
                </p>
                <FriendBtn id={id} />
            </div>
        );
    } else {
        return (
            <div className="cursor-not-allowed">
                <p className="font-mono text-6xl mb-8 text-[#F2784B]">404</p>
                <p className="font-mono leading-8 mb-8 italic text-[#F2784B]">
                    Sorry! <br /> The user you were searching for does not
                    exist.
                </p>{" "}
                <button className="cursor-not-allowed focus:cursor-not-allowed px-6 h-12 uppercase font-semibold tracking-wider rounded-lg border-2 border-[#F2784B] text-[#F2784B] hover:text-[#021A25] hover:bg-[#F2784B]">
                    <Link className="cursor-not-allowed" to="/users">
                        bring me back
                    </Link>{" "}
                </button>
                <div>
                    <img
                        src={"/social-network_grafik-404.svg"}
                        className="fixed bottom-0 -z-10 w-1/3 right-20 mb-20"
                    />
                </div>
            </div>
        );
    }
}
