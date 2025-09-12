import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import RootLayout from "./components/RootLayout";
import Product from "./pages/product/Product";
import { BrowserRouter } from "react-router-dom";
import Promotion from "./pages/promotion/Promotion";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<RootLayout />}>
                    <Route index path="/" element={<Home />} />
                    <Route path="product" element={<Product />} />
                    <Route path="promotion" element={<Promotion />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
