import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Banner from "./pages/home/Banner";
import ProductList from "./pages/home/ProductList";
import Footer from "./components/Footer";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
                <Header></Header>
                <Banner></Banner>
                <ProductList></ProductList>
                <Footer></Footer>
            </div>
        </>
    );
}

export default App;
