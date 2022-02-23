import { Component } from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            code: "",
            password: "",
            // 1 = start, 2 = verify, 3 = success
            step: 1,
            error: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleVerify = this.handleVerify.bind(this);
        this.handleDark = this.handleDark.bind(this);
    }

    handleChange(evt) {
        console.log(evt.target.name, evt.target.value);

        this.setState({ [evt.target.name]: evt.target.value });
    }

    handleSubmit(evt) {
        evt.preventDefault();

        console.log(
            "the 'handleSubmit' event in ReserPassword.js to reset the password for step",
            this.state.step,
            "was triggered."
        );

        const givenEmail = {};

        givenEmail.email = this.state.email;

        console.log(givenEmail);

        fetch("/password/reset/start.json", {
            method: "POST",
            body: JSON.stringify(givenEmail),
            headers: {
                "content-type": "application/json",
            },
        }).then((res) => {
            console.log("res.ok", res.ok);

            if (res.ok) {
                // status code in 200 range:
                // user succesfully got a mail with the verify code
                // let's got to step 2 to verify the code
                this.setState({ step: 2 });
                console.log(
                    "the fetch request '/password/reset/start.json' in ResetPassword.js was triggerd. we successfully went to step 2"
                );
            } else {
                // status code is in 400 or 500 range
                // an error message will be shown to the user
                this.setState({ error: true });
            }
        });
    }

    handleVerify(evt) {
        evt.preventDefault();

        console.log(
            "the 'handleVerify' event in the ResetPassword.js to verify the code for step",
            this.state.step,
            "was triggered."
        );

        const givenCode = {};

        givenCode.email = this.state.email;
        givenCode.code = this.state.code;
        givenCode.password = this.state.password;

        console.log(givenCode);

        fetch("/password/reset/verify.json", {
            method: "POST",
            body: JSON.stringify(givenCode),
            headers: {
                "content-type": "application/json",
            },
        }).then((res) => {
            console.log("res.ok", res.ok);

            if (res.ok) {
                // status code in 200 range:
                // user succesfully set a new password
                // let's got to step 3
                this.setState({ step: 3 });
                console.log(
                    "the fetch request '/password/reset/verify.json' in ResetPassword.js was triggerd. we successfully went to step 3"
                );
            } else {
                // status code is in 400 or 500 range
                // an error message will be shown to the user
                this.setState({ error: true });
            }
        });
    }

    // clickEvent to change the color mode
    handleDark() {
        if (document.querySelector("html").classList.contains("dark")) {
            // document.querySelector("html").classList = "dark";
            document.querySelector("html").classList.remove("dark");
            document.querySelector("#toggle-circle").classList.remove("dark");
        } else {
            document.querySelector("html").classList.add("dark");
            document.querySelector("#toggle-circle").classList.add("dark");
        }
    }

    render() {
        if (this.state.step === 1) {
            return (
                <div>
                    {
                        <img
                            className="mx-auto h-40 w-auto"
                            src="social-network_logo.svg"
                        />
                    }{" "}
                    <p className="font-sans text-[#F2F2F2] mb-8">
                        Please enter your email address to search for your
                        account:
                    </p>
                    <form
                        className="grid grid-row place-content-center space-y-4"
                        onSubmit={this.handleSubmit}
                    >
                        <input
                            className="focus:ring-2 focus:ring-[#D7F205] focus:outline-none appearance-none w-full leading-6 focus:text-[#D7F205] text-[#F2F2F2] text-center placeholder:text-[#F2F2F2] placeholder:text-center rounded-md py-2 p-10 ring-1 ring-[#F2F2F2] shadow-sm bg-[#021A25] dark:bg-[#BF046B]"
                            type="email"
                            name="email"
                            placeholder="email *"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                        <p className="text-xs italic text-[#F2F2F2]">
                            * mandatory fields
                        </p>
                        <button
                            className="px-6 h-12 uppercase font-semibold tracking-wider rounded-lg border-2 border-[#D7F205] bg-[#D7F205] text-[#021A25] hover:border-[#F2F2F2] hover:bg-[#F2F2F2] hover:cursor-zoom-in dark:text-[#BF046B]"
                            type="submit"
                        >
                            search
                        </button>
                    </form>
                    {this.state.error && (
                        <p className="mt-4 italic text-[#F2784B]">
                            Oh no, something went wrong. Please try it again.
                        </p>
                    )}
                    <p className="font-mono text-xs leading-6 mt-4 text-[#D7F205]">
                        <Link className="cursor-no-drop" to="/login">
                            Cancel
                        </Link>
                    </p>
                    <button
                        type="button"
                        className="mt-8 bg-[#021A25] relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-[#F2F2F2] rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D7F205] hover:cursor-ew-resize dark:bg-[#BF046B]"
                        role="switch"
                        aria-checked="false"
                        onClick={this.handleDark}
                    >
                        <span className="sr-only"></span>
                        <span
                            id="toggle-circle"
                            aria-hidden="true"
                            className="translate-x-0 dark:translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-[#D7F205] shadow transform ring-0 transition ease-in-out duration-200"
                        ></span>
                    </button>
                </div>
            );
        } else if (this.state.step === 2) {
            return (
                <div>
                    {
                        <img
                            className="mx-auto h-40 w-auto"
                            src="social-network_logo.svg"
                        />
                    }{" "}
                    <p className="font-sans text-[#F2F2F2] mb-8">
                        We have just sent you a confirmation code via email.
                        Please enter this code with your new password.
                    </p>
                    <form
                        className="grid grid-row place-content-center space-y-4"
                        onSubmit={this.handleVerify}
                    >
                        <input
                            className="focus:ring-2 focus:ring-[#D7F205] focus:outline-none appearance-none w-full leading-6 focus:text-[#D7F205] text-[#F2F2F2] text-center placeholder:text-[#F2F2F2] placeholder:text-center rounded-md py-2 p-10 ring-1 ring-[#F2F2F2] shadow-sm bg-[#021A25] dark:bg-[#BF046B]"
                            type="code"
                            name="code"
                            placeholder="code *"
                            value={this.state.code}
                            onChange={this.handleChange}
                        />
                        <input
                            className="focus:ring-2 focus:ring-[#D7F205] focus:outline-none appearance-none w-full leading-6 focus:text-[#D7F205] text-[#F2F2F2] text-center placeholder:text-[#F2F2F2] placeholder:text-center rounded-md py-2 p-10 ring-1 ring-[#F2F2F2] shadow-sm bg-[#021A25] dark:bg-[#BF046B]"
                            type="password"
                            name="password"
                            placeholder="password *"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                        <p className="text-xs italic text-[#F2F2F2]">
                            * mandatory fields
                        </p>
                        <button
                            className="px-6 h-12 uppercase font-semibold tracking-wider rounded-lg border-2 border-[#D7F205] bg-[#D7F205] text-[#021A25] hover:border-[#F2F2F2] hover:bg-[#F2F2F2] hover:cursor-progress dark:text-[#BF046B]"
                            type="submit"
                        >
                            verify
                        </button>
                    </form>
                    {this.state.error && (
                        <p className="mt-4 italic text-[#F2784B]">
                            Oh no, something went wrong. Please try it again.
                        </p>
                    )}
                    <button
                        type="button"
                        className="mt-8 bg-[#021A25] relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-[#F2F2F2] rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D7F205] hover:cursor-ew-resize dark:bg-[#BF046B]"
                        role="switch"
                        aria-checked="false"
                        onClick={this.handleDark}
                    >
                        <span className="sr-only"></span>
                        <span
                            id="toggle-circle"
                            aria-hidden="true"
                            className="translate-x-0 dark:translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-[#D7F205] shadow transform ring-0 transition ease-in-out duration-200"
                        ></span>
                    </button>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center">
                    <img
                        className="mx-auto h-40 w-auto"
                        src="social-network_logo.svg"
                    />
                    <h2 className="font-mono text-[#D7F205] text-lg">
                        Your password reset was successful!
                    </h2>
                    <button className="mx-auto mt-8 px-6 h-12 uppercase font-semibold tracking-wider rounded-lg border-2 border-[#F2F2F2] text-[#F2F2F2] hover:border-[#D7F205] hover:text-[#D7F205] hover:cursor-alias">
                        <Link className="cursor-alias" to="/login">
                            login
                        </Link>
                    </button>
                    <button
                        type="button"
                        className="mt-8 bg-[#021A25] relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-[#F2F2F2] rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D7F205] hover:cursor-ew-resize dark:bg-[#BF046B]"
                        role="switch"
                        aria-checked="false"
                        onClick={this.handleDark}
                    >
                        <span className="sr-only"></span>
                        <span
                            id="toggle-circle"
                            aria-hidden="true"
                            className="translate-x-0 dark:translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-[#D7F205] shadow transform ring-0 transition ease-in-out duration-200"
                        ></span>
                    </button>
                </div>
            );
        }
    }
}
