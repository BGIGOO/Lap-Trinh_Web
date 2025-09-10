import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Banner from "./components/Banner";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div className="min-h-screen bg-white text-slate-800">
                <Header></Header>
                <Banner></Banner>
            </div>
        </>
    );
}

export default App;
