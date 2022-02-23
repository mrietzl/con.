import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
    recieveFriends,
    unfriend,
    acceptFriend,
} from "./redux/friends/slice.js";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friends) => friends.accepted === true)
    );
    const wannabes = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friends) => friends.accepted === false)
    );

    useEffect(() => {
        fetch("/friends-wannabes.json")
            .then((res) => {
                console.log("we are in the useEffect. res is:", res);
                return res.json();
            })
            .then((data) => {
                console.log("we are in the dispatch block. the data is:", data);
                dispatch(recieveFriends(data));
            });
    }, []);

    function handleUnfriend(friendsId) {
        console.log("unfriend button clicked. the 'friendsId' is", friendsId);

        fetch(`/end-friendship/${friendsId}.json`, { method: "POST" }).then(
            () => {
                dispatch(unfriend(friendsId));
            }
        );
    }

    function handleAccept(friendsId) {
        console.log("accept button clicked. the 'friendsId' is", friendsId);

        fetch(`/accept-friend-request/${friendsId}.json`, {
            method: "POST",
        }).then(() => {
            dispatch(acceptFriend(friendsId));
        });
    }

    if (!friends || !wannabes) {
        return null;
    }

    const myFriends = (
        <div>
            {friends.map((friends) => (
                <div className="flex flex-row justify-center" key={friends.id}>
                    <div className="flex flex-col items-center">
                        <p className="font-mono text-xs leading-6 text-[#F2F2F2] mb-4">
                            People who are your friend:
                        </p>{" "}
                        <Link to={`/user/${friends.id}`}>
                            <img
                                className={`h-32 w-32 object-cover mt-2 mb-2 flex grid self-center ${
                                    friends.className
                                } ${
                                    friends.picture
                                        ? "rounded-lg border-2 border-[#F2F2F2] hover:border-[#D7F205]"
                                        : ""
                                }`}
                                src={
                                    friends.picture ||
                                    "/default-icon-profile-picture.svg"
                                }
                            />
                            <p className="font-mono text-[#D7F205] mt-2 mb-2">
                                {" "}
                                {friends.first} {friends.last}{" "}
                            </p>
                        </Link>
                        <div>
                            <button
                                className="font-mono text-xs leading-6 text-[#D7F205]"
                                onClick={() => handleUnfriend(friends.id)}
                            >
                                unfriend
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const myWannabes = (
        <div>
            {wannabes.map((wannabes) => (
                <div
                    className="flex flex-row justify-center mt-8 mb-8"
                    key={wannabes.id}
                >
                    <div className="flex flex-col items-center">
                        <p className="font-mono text-xs leading-6 text-[#F2F2F2] mb-4">
                            People who want to be your friend:
                        </p>{" "}
                        <Link to={`/user/${wannabes.id}`}>
                            <img
                                className={`h-32 w-32 object-cover mt-2 mb-2 flex grid self-center ${
                                    wannabes.className
                                } ${
                                    wannabes.picture
                                        ? "rounded-lg border-2 border-[#F2F2F2] hover:border-[#D7F205]"
                                        : ""
                                }`}
                                src={
                                    wannabes.picture ||
                                    "/default-icon-profile-picture.svg"
                                }
                            />
                            <p className="font-mono text-[#D7F205] mt-2 mb-2">
                                {" "}
                                {wannabes.first} {wannabes.last}{" "}
                            </p>
                        </Link>
                        <div>
                            <button
                                className="font-mono text-xs leading-6 text-[#D7F205]"
                                onClick={() => handleAccept(wannabes.id)}
                            >
                                accept friend request
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <div>
                {!friends.length && (
                    <p className="font-mono text-xs leading-6 text-[#F2F2F2] italic mb-4">
                        Sorry, but you currently have no friendships.
                    </p>
                )}
                {!!friends.length && myFriends}
            </div>
            <div>
                {!wannabes.length && (
                    <p className="font-mono text-xs leading-6 text-[#F2F2F2] italic mt-8 mb-4">
                        Sorry, but you currently have no open friend requests.
                    </p>
                )}
                {!!wannabes.length && myWannabes}
            </div>
        </div>
    );
}
