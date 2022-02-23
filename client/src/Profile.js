import BioEditor from "./BioEditor.js";
import ProfilePicture from "./ProfilePicture.js";

export default function Profile(props) {
    function handleDelete() {
        console.log("'delete account' button was clicked.");

        fetch(`/delete-account.json`, {
            method: "POST",
        }).then((res) => {
            if (res.ok) {
                location.href = "/";
            }
        });
    }

    return (
        <div className="flex flex-col gap-y-4">
            {/* prop drilling: passing props from
                parent -> child -> grandchild -> … */}
            <div className="flex justify-center mt-4 mb-4">
                {/*                 <p className="font-mono text-xs leading-6 mt-4 text-[#D7F205]">
                    Add a profile picture
                </p> */}

                <ProfilePicture
                    className="h-32 w-32 object-cover hover:cursor-copy"
                    picture={props.picture}
                    firstname={props.firstname}
                    lastname={props.lastname}
                    toggleUploader={props.toggleUploader}
                />
            </div>

            <p className="font-mono text-[#D7F205]">
                {props.firstname} {props.lastname}
            </p>
            <BioEditor bio={props.bio} update={props.update} />

            <button
                className="font-mono text-xs leading-6 mt-4 text-[#F2F2F2] hover:text-[#D7F205] hover:cursor-help"
                type="submit"
                onClick={handleDelete}
            >
                delete my account
            </button>
        </div>
    );
}
