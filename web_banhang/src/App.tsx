import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./pages/contexts/AuthContext";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home/Home";
import CategoryPage from "./pages/CategoryPage";
import Product from "./pages/Product/Product";
import SearchResultPage from "./pages/SearchResultPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Cart from "./pages/Cart/Cart";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      
        <div className="min-h-screen flex flex-col">
          <Header />
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/:category/:subcategory" element={<CategoryPage />} />
              <Route path="/:category" element={<CategoryPage />} />
              <Route path="/search" element={<SearchResultPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Footer />
          
          {/* Auth Modal - Render globally */}
          <AuthModal />
        </div>
      
    </AuthProvider>
  );
}

export default App;