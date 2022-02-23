export default function ProfilePicture(props) {
    console.log("ProfilePicture props", props);

    return (
        <img
            className={`object-cover flex grid self-center ${props.className} ${
                props.picture
                    ? "rounded-lg border-2 border-[#F2F2F2] hover:border-[#D7F205]"
                    : ""
            }`}
            src={props.picture || "/default-icon-profile-picture.svg"}
            alt={`${props.firstname} ${props.lastname}`}
            onClick={props.toggleUploader}
        />
    );
}
