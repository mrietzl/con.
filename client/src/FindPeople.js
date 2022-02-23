import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [user, setUser] = useState("");
    const [users, setUsers] = useState([]);

    // this effect will run everytime `country` state changes
    useEffect(() => {
        // handling out-of-order responses
        let ignore = false;

        if (user !== "") {
            fetch(`users.json?q=${user}`)
                .then((res) => {
                    // status code in 2xx range
                    if (res.ok) {
                        return res.json();
                    } else {
                        return [];
                    }
                })
                .then((data) => {
                    // only save data in state if ignore is false
                    if (!ignore) {
                        setUsers(data);
                    }

                    // if ignore is true we just ignore the response
                });

            // cleanup function:
            // react will run the cleanup function in between useEffect runs
            return () => {
                ignore = true;
            };
        } else {
            setUsers([]);
        }
    }, [user]);

    return (
        <div>
            <p className="font-sans text-[#F2F2F2] mb-8">
                Incremental People Search:
            </p>
            <input
                className="focus:ring-2 focus:ring-[#D7F205] focus:outline-none appearance-none w-full leading-6 focus:text-[#D7F205] text-[#F2F2F2] text-center placeholder:text-[#F2F2F2] placeholder:text-center rounded-md py-2 p-10 ring-1 ring-[#F2F2F2] shadow-sm bg-[#021A25] dark:bg-[#BF046B]"
                type="text"
                name="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
            />
            <ul>
                {/* this is how to do loops in react 
                for the key value we can use the id or email …
                … because both of the are UNIQUE */}
                {users.map((val) => {
                    return (
                        <li key={val.id}>
                            <Link to={`/user/${val.id}`}>
                                <ul className="flex items-center font-mono hover:text-[#D7F205] border-b border-[#F2F2F2] py-4">
                                    <img
                                        className={`mr-8 h-16 w-16 object-cover ${
                                            val.className
                                        } ${
                                            val.picture
                                                ? "rounded-lg border-2 border-[#F2F2F2] hover:border-[#D7F205]"
                                                : ""
                                        }`}
                                        src={
                                            val.picture ||
                                            "/default-icon-profile-picture.svg"
                                        }
                                        alt={`${val.first} ${val.last}`}
                                    />
                                    {val.first} {val.last}
                                </ul>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
