import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";
import SearchResultPage from "./pages/SearchResultPage";
import { AuthProvider } from "./pages/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:category/:subcategory" element={<CategoryPage />} />
        <Route path="/:category" element={<CategoryPage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
    </AuthProvider>
    
  );
}

export default App;
