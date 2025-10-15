import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:category/:subcategory" element={<CategoryPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
