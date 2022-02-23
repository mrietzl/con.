export default function Footer() {
    return (
        <footer>
            <div className="flex justify-self-end px-8">
                <div className="w-full flex items-center justify-center ml-8 mr-8 h-20 mt-20 border-t border-[#F2F2F2]">
                    <p className="font-mono text-xs text-center text-[#F2F2F2]">
                        Copyright © {new Date().getFullYear()} con. | made by
                        Michèle Rietzl
                        {/*                         {" "}
                        <a
                            className="hover:text-[#D7F205] underline"
                            href="http://mk-rietzl.de/"
                        >
                            mk-rietzl
                        </a> */}
                    </p>

                    {/*                     <a href="https://github.com/mrietzl" target={"_blank"}>
                        {
                            <img
                                className="h-8 w-8"
                                src="social-network_icon-github.svg"
                            />
                        }{" "}
                    </a> */}
                </div>
            </div>
        </footer>
    );
}
