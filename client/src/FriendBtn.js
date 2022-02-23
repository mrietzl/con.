import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FriendBtn() {
    const { id } = useParams(); // url params
    const [buttonText, setbuttonText] = useState("");

    useEffect(() => {
        fetch(`/friendshipstatus/${id}.json`)
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                setbuttonText(res);
            });
    });

    function handleClick() {
        console.log("the 'FriendBtn' button from FriendBtn.js was triggered.");

        if (buttonText === "send friend request") {
            fetch(`/send-friend-request/${id}.json`, {
                method: "POST",
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    setbuttonText(res);
                });
        } else if (buttonText === "accept friend request") {
            fetch(`/accept-friend-request/${id}.json`, {
                method: "POST",
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    setbuttonText(res);
                });
        } else if (buttonText === "unfriend") {
            fetch(`/end-friendship/${id}.json`, {
                method: "POST",
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    setbuttonText(res);
                });
        } else if (buttonText === "cancel friend request") {
            fetch(`/end-friendship/${id}.json`, {
                method: "POST",
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    setbuttonText(res);
                });
        } else {
            console.log("something went wrong … from FriendBtn.js l.46");
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="mt-4 px-6 h-12 uppercase font-semibold tracking-wider rounded-lg border-2 border-[#F2F2F2] text-[#F2F2F2] hover:border-[#D7F205] hover:text-[#D7F205]"
        >
            {buttonText}
        </button>
    );
}
