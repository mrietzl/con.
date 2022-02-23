// reducer
export default function messagesReducer(state = null, action) {
    // reducer needs to be able to handle
    // chatMessages and chatMessage actions
    if (action.type == "chat/chatMessages") {
        state = action.payload.messages;
        console.log(
            "received action for the 'chatMessages' request from the slice.js. the action is:",
            action
        );
        return state;
    } else if (action.type == "chat/chatMessage") {
        console.log(
            "received action for the 'chatMessage' request from the slice.js. the action is:",
            action
        );

        const newState = [...state];

        newState.push(action.payload.message);

        return newState;
    }

    return state;
}

// action creators
export function chatMessages(messages) {
    // implement action object
    return {
        type: "chat/chatMessages",
        payload: { messages },
    };
}

export function chatMessage(message) {
    // implement action object
    return {
        type: "chat/chatMessage",
        payload: { message },
    };
}
