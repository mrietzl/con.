// reducer
export default function friendsReducer(state = null, action) {
    if (action.type == "friends/recieveFriends") {
        state = action.payload.friends;

        /* other thought:
        const newState = [...state];

        for (let i = 0; i < newState.length; i++) {
            if (newState[i].id === action.payload.id) {
                newState[i] = {
                    ...newState[i],
                    friends: action.payload.friends,
                };
            }
        } */
    } else if (action.type == "friends/acceptFriend") {
        console.log(
            "received action for the 'acceptFriend' request from the slice.js. the action is:",
            action
        );

        const newState = [...state];

        for (let i = 0; i < newState.length; i++) {
            if (newState[i].id === action.payload.id) {
                newState[i] = {
                    ...newState[i],
                    accepted: true,
                };
            }
        }

        return newState;
    } else if (action.type == "friends/unfriend") {
        console.log(
            "received action for the 'unfriend' request from the slice.js. the action is:",
            action
        );

        /*         const newState = [...state];

        for (let i = 0; i < newState.length; i++) {
            if (newState[i].id !== action.payload.id) {
                newState[i] = {
                    ...newState[i],
                };
            }
        } */

        // filter: leaves the original array unchanged (NOT mutated)
        const newState = state.filter(function (unfriendFilter) {
            console.log("'unfriend'-filter is triggered");

            return unfriendFilter.id !== action.payload.id;
            // if we return true: that element will be part of the filtered array
            // if we return false: that element will NOT be part the filtered array
        });

        return newState;
    }

    return state;
}

// action creators
export function recieveFriends(friends) {
    return {
        type: "friends/recieveFriends",
        payload: { friends },
    };
}

export function acceptFriend(id) {
    return {
        type: "friends/acceptFriend",
        payload: { id },
    };
}

export function unfriend(id) {
    return {
        type: "friends/unfriend",
        payload: { id },
    };
}
