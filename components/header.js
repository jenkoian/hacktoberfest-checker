import Link from "next/link";

function Header() {

    return (
        <header className="bg-teal-500">
            <div className="flex flex-wrap md:flex-no-wrap items-center justify-between max-w-4xl mx-auto p-4 md:p-8">
                <div className="flex items-center">
                    <Link href="/">
                        <a className="font-bold text-white text-xl">
                            Next.js Starter Tailwind
                        </a>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
