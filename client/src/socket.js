import { io } from "socket.io-client";

import { chatMessages, chatMessage } from "./redux/messages/slice.js";

export let socket;

// singleton pattern:
// make sure that we only ever have one single websocket connection open
export function init(store) {
    if (!socket) {
        socket = io();

        // load last 10 chat messages
        socket.on("chatMessages", (messages) => {
            // bringing messages into redux store
            store.dispatch(chatMessages(messages));
        });

        // some user wrote a new message
        socket.on("chatMessage", (message) => {
            // bringing message into redux store
            store.dispatch(chatMessage(message));
        });
    }
}
