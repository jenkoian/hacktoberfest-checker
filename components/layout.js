import React from "react"
import Header from "./header";
import Footer from "./footer";
import "../styles/index.css";

function Layout(props) {
    return (
        <div className="md:py-4 flex-grow flex-no-shrink">
            <Header />
            <main className="md:py-4">
                {props.children}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
