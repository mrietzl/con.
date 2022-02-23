import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            draft: this.props.bio,
            editing: false,
            error: false,
        };

        this.updateDraft = this.updateDraft.bind(this);
        this.submitBio = this.submitBio.bind(this);
        this.addBio = this.addBio.bind(this);
    }

    updateDraft(evt) {
        console.log(
            "the 'updateDraft' method from BioEditor.js was triggered. the new value of the input field is: ",
            evt.target.value
        );
        this.setState({ draft: evt.target.value });
    }

    submitBio(evt) {
        evt.preventDefault();
        const bioDraft = { bio: this.state.draft };
        console.log(
            "the 'submitBio' method from BioEditor.js was triggered. the new bio draft is: ",
            bioDraft
        );

        fetch("/bio.json", {
            method: "POST",
            body: JSON.stringify(bioDraft),
            headers: {
                "content-type": "application/json",
            },
        }).then((res) => {
            console.log("res.ok", res.ok);
            if (res.ok) {
                // if the fetch request was successful …
                // … we can change the editing mode to 'false' again.
                console.log(this.props);
                this.props.update(bioDraft.bio);
                this.setState({ editing: false });
                console.log(
                    "the fetch request '/bio.json' in the BioEditor.js was successful and the editing mode was set to 'false'."
                );
            } else {
                // if the fetch request was NOT successful …
                // … we will show an error message to the user
                this.setState({ error: true });
            }
        });
    }

    addBio(evt) {
        evt.preventDefault();
        this.setState({ editing: true });
    }

    render() {
        // user is in editing
        if (this.state.editing) {
            return (
                <div className="flex flex-col gap-y-4">
                    <textarea
                        className="focus:ring-2 focus:ring-[#D7F205] focus:outline-none appearance-none max-w-xl focus:text-[#D7F205] text-[#F2F2F2] text-center placeholder:text-[#F2F2F2] placeholder:text-center rounded-md py-2 p-10 ring-1 ring-[#F2F2F2] shadow-sm bg-[#021A25] dark:bg-[#BF046B]"
                        value={this.state.draft}
                        /* onChange event listener to update state.draft */
                        onChange={this.updateDraft}
                    />
                    {/* onClick event listener to send the new bio draft to the db*/}
                    <button
                        className="font-mono text-xs leading-6 text-[#F2F2F2] hover:text-[#D7F205]"
                        onClick={this.submitBio}
                    >
                        save
                    </button>
                    {this.state.error && (
                        <p className="mt-4 italic text-[#F2784B]">
                            Oh no, something went wrong. Please try it again.
                        </p>
                    )}
                </div>
            );
            // user is not in editing mode & already has a bio
        } else if (this.props.bio) {
            return (
                <div>
                    <p>{this.props.bio}</p>
                    {/* onClick event listener to set the editing mode to 'true' */}
                    <button
                        className="mt-8 px-6 h-12 uppercase font-semibold tracking-wider rounded-lg border-2 border-[#F2F2F2] text-[#F2F2F2] hover:border-[#D7F205] hover:text-[#D7F205]"
                        onClick={this.addBio}
                    >
                        edit my profile
                    </button>
                </div>
            );
            // user is not in editing mode & has NO bio yet
        } else {
            /* onClick event listener to set the editing mode to 'true' */
            return (
                <button
                    className="px-6 h-12 uppercase font-semibold tracking-wider rounded-lg border-2 border-[#D7F205] bg-[#D7F205] text-[#021A25] hover:border-[#F2F2F2] hover:bg-[#F2F2F2] hover:cursor-copy dark:text-[#BF046B]"
                    onClick={this.addBio}
                >
                    Add bio
                </button>
            );
        }
    }
}
