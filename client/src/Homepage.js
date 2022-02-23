import { Component } from "react";
import { Link } from "react-router-dom";

export default class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.handleDark = this.handleDark.bind(this);
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
        return (
            <div className="h-screen flex flex-col text-center justify-center items-center">
                <img
                    className="mx-auto h-40 w-auto"
                    src="social-network_logo.svg"
                />
                <p className="font-mono text-lg leading-10 mb-4 text-[#D7F205]">
                    Welcome to con.
                </p>
                <p className="font-sans text-[#F2F2F2] mb-8">
                    The meeting plattform for Designer and Web Developer.
                </p>
                <button className="mx-auto px-6 mt-4 h-12 uppercase font-semibold tracking-wider rounded-lg border-2 border-[#D7F205] bg-[#D7F205] text-[#021A25] hover:border-[#F2F2F2] hover:bg-[#F2F2F2] hover:cursor-copy dark:text-[#BF046B]">
                    <Link className="cursor-copy " to="/registration">
                        register
                    </Link>
                </button>
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
