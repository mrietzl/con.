import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { socket } from "./socket.js";

export default function Chat() {
    const [draft, setDraft] = useState("");

    const messages = useSelector((state) => state.messages);

    // this will initially be `null`
    console.log("messages", messages);

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault(); // prevents the textarea from inserting a new line

            // emit socket event to server
            socket.emit("chatMessage", draft);

            setDraft("");
        }
    }

    function handleClick() {
        // emit socket event to server
        socket.emit("chatMessage", draft);

        setDraft("");
    }

    if (!messages) {
        return null;
    }

    const allMessages = (
        <div className="flex flex-col-reverse">
            {messages.map((messages) => (
                <div key={messages.id}>
                    <Link to={`/user/${messages.sender_id}`}>
                        <div className="flex flex-col items-center m-4 max-w-4xl">
                            <img
                                className={`h-16 w-16 object-cover mt-2 mb-2 flex grid self-center mr-4 ${
                                    messages.className
                                } ${
                                    messages.picture
                                        ? "rounded-lg border-2 border-[#F2F2F2] hover:border-[#D7F205]"
                                        : ""
                                }`}
                                src={
                                    messages.picture ||
                                    "/default-icon-profile-picture.svg"
                                }
                            />{" "}
                            <div className="flex flex-row items-center ml-32 mr-32">
                                <p className="font-mono text-xs leading-6 text-[#F2F2F2]">
                                    {messages.first} {messages.last}:<br></br>
                                    <p className="italic">{messages.message}</p>
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <p className="font-sans text-[#F2F2F2] mb-8">
                Welcome to our open chat:
            </p>
            <div className="max-h-80 overflow-x-scroll overscroll-contain border-2 rounded-lg m-8 bg-opacity-25 bg-[#F2F2F2]">
                {!messages.length && (
                    <p className="font-mono text-xs leading-6 text-[#F2F2F2] mb-4">
                        Sorry, but there are no messages yet.
                    </p>
                )}
                {!!messages.length && allMessages}
            </div>
            <div className="flex flex-col items-center gap-y-4">
                <textarea
                    className="focus:ring-2 focus:ring-[#D7F205] focus:outline-none appearance-none max-w-xl focus:text-[#D7F205] text-[#F2F2F2] text-center placeholder:text-[#F2F2F2] placeholder:text-center rounded-md py-2 p-10 ring-1 ring-[#F2F2F2] shadow-sm bg-[#021A25] dark:bg-[#BF046B]"
                    value={draft}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="write your chat message here …"
                />
                <button
                    className="font-mono text-xs leading-6 text-[#F2F2F2] hover:text-[#D7F205] disabled:hover:text-[#F2F2F2] disabled:hover:cursor-not-allowed"
                    onClick={handleClick}
                    disabled={draft === ""}
                >
                    save
                </button>
            </div>
        </div>
    );
}
