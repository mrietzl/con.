import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            error: false,
        };

        this.pictureUpload = this.pictureUpload.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    pictureUpload(evt) {
        // testing issues
        // this.props.sayHello("Michèle");

        // we need to work with FormData,
        // because we want to POST a file:
        evt.preventDefault();
        const formData = new FormData();
        formData.append("file", this.state.file);
        console.log(
            "the 'pictureUpload' event in the Uloader.js was triggered. this.state.file is:",
            this.state.file
        );

        fetch("/picture.json", {
            method: "POST",
            body: formData,
        })
            .then((res) => {
                console.log("res.ok", res.ok);
                return res.json();
            })
            .then((data) => {
                if (data.picture === "") {
                    this.setState({ error: true });
                } else {
                    console.log(
                        "the fetch request '/picture.json' in the Uploader.js was triggered. the data is set. this.state.file is:",
                        this.state.file,
                        "data.picture is:",
                        data.picture
                    );
                    this.props.uploadImage(data.picture);
                }
            });
    }

    handleChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    render() {
        return (
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div
                        className="fixed inset-0 bg-[#F2F2F2] bg-opacity-50 transition-opacity"
                        onClick={this.props.toggleUploader}
                    >
                        {" "}
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                        &#8203;
                    </span>
                    <div className="inline-block bg-[#021A25] rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-[#BF046B]">
                        <p className="font-mono text-xs leading-6 text-[#F2F2F2] mt-4">
                            Please select an image
                        </p>

                        <form
                            className="grid grid-row place-content-center space-y-4 mb-4 mt-4"
                            onSubmit={this.pictureUpload}
                        >
                            <input
                                className="block w-full text-sm text-[#F2F2F2] file:mr-4 file:px-6 file:h-12 file:uppercase file:font-semibold tracking-wider file:rounded-lg file:border-2 file:border-[#F2F2F2] shadow-none file:bg-[#021A25] file:text-[#F2F2F2] file:hover:border-[#D7F205] file:hover:text-[#D7F205] dark:bg-[#BF046B] dark:file:bg-[#BF046B]"
                                type="file"
                                accept="image/*"
                                id="file"
                                onChange={this.handleChange}
                            />
                            <button
                                className="font-mono text-xs leading-6 mt-4 text-[#D7F205]"
                                type="submit"
                            >
                                upload
                            </button>
                        </form>
                    </div>
                </div>

                {this.state.error && (
                    <p className="mt-4 italic text-[#F2784B]">
                        Oh no, something went wrong. Please try it again.
                    </p>
                )}
            </div>
        );
    }
}
