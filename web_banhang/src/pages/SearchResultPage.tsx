import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllProducts } from "../services/mockProducts";
import type { ProductMock } from "../services/mockProducts";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { Search, X } from "lucide-react";

const SearchResultPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<ProductMock[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductMock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // lọc
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000000
  });

  // Tải tất cả sản phẩm
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Reset phân trang khi lọc thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategories, selectedSizes, sortBy, priceRange]);

  // Lọc và tìm kiếm sản phẩm
  useEffect(() => {
    let results = products;

    // Áp dụng lọc tìm kiếm nếu query tồn tại
    if (query) {
      results = results.filter(product => {
        const searchLower = query.toLowerCase();
        return (
          product.title.toLowerCase().includes(searchLower) ||
          product.category?.toLowerCase().includes(searchLower) ||
          product.subCategory?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Áp dụng lọc danh mục
    if (selectedCategories.length > 0) {
      results = results.filter(product => 
        product.category && selectedCategories.includes(product.category)
      );
    }

    // Áp dụng lọc kích cỡ
    if (selectedSizes.length > 0) {
      results = results.filter(product => 
        product.sizes?.some(size => selectedSizes.includes(size))
      );
    }

    // Áp dụng lọc khoảng giá
    results = results.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Áp dụng sắp xếp
    switch (sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        results.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredProducts(results);
  }, [query, products, selectedCategories, selectedSizes, sortBy, priceRange]);

  // Trích xuất danh mục khác nhau
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  
  // Trích xuất kích cỡ có sẵn
  const availableSizes = Array.from(
    new Set(products.flatMap(p => p.sizes || []))
  ).sort();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchParams({});
    setFilteredProducts([]);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSortBy("default");
    setPriceRange({ min: 0, max: 1000000 });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Logic phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Xử lý sự kiện phân trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Search bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Không có query tìm kiếm - Hiển thị tất cả sản phẩm */}
      {!query && (
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <div className="w-1/4 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-4">
            {/* Bộ lọc đang áp dụng */}
            {(selectedCategories.length > 0 || selectedSizes.length > 0 || sortBy !== 'default') && (
              <div className="mb-4 flex items-center justify-between bg-blue-50 p-3 rounded">
                <span className="text-sm text-blue-800">
                  {selectedCategories.length + selectedSizes.length + (sortBy !== 'default' ? 1 : 0)} bộ lọc
                </span>
                <button 
                  onClick={handleClearFilters}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* Danh mục */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Danh mục</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category as string)}
                      onChange={() => handleCategoryToggle(category as string)}
                      className="w-4 h-4 accent-gray-800"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sắp xếp */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Sắp xếp</h3>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name-asc">Tên: A-Z</option>
                <option value="name-desc">Tên: Z-A</option>
              </select>
            </div>

            {/* Kích cỡ */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Kích cỡ</h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-2 py-2 text-xs border rounded transition-colors whitespace-nowrap ${
                        selectedSizes.includes(size)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Khoảng giá */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Khoảng giá</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={priceRange.min || ''}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={priceRange.max === 1000000 ? '' : priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 1000000 }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {formatPrice(priceRange.min)} ₫ - {formatPrice(priceRange.max)} ₫
                </div>
              </div>
            </div>
          </div>

          {/* All Products */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Tất cả sản phẩm
              </h1>
              <p className="text-gray-600">
                Hiển thị {filteredProducts.length} sản phẩm
              </p>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            )}

            {/* Grid sản phẩm */}
            {!isLoading && currentProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      title={product.title}
                      price={product.price}
                      images={product.images}
                      badges={product.badges}
                      onCardClick={() => navigate(`/product/${product.id}`)}
                      onAddToCart={() => {
                        console.log('Add to cart:', product.id);
                        alert(`Đã thêm "${product.title}" vào giỏ hàng!`);
                      }}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}

            {/* No results */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Không có sản phẩm
                </h3>
                <p className="text-gray-500 mb-4">
                  Không có sản phẩm nào phù hợp với bộ lọc
                </p>
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 hover:underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search kết quả */}
      {query && (
        <div className="flex gap-8">
          {/* Sidebar lọc */}
          <div className="w-1/4 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-4">
            {/* Bộ lọc đang áp dụng */}
            {(selectedCategories.length > 0 || selectedSizes.length > 0 || sortBy !== 'default') && (
              <div className="mb-4 flex items-center justify-between bg-blue-50 p-3 rounded">
                <span className="text-sm text-blue-800">
                  {selectedCategories.length + selectedSizes.length + (sortBy !== 'default' ? 1 : 0)} bộ lọc
                </span>
                <button 
                  onClick={handleClearFilters}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* Danh mục */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Danh mục</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category as string)}
                      onChange={() => handleCategoryToggle(category as string)}
                      className="w-4 h-4 accent-gray-800"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sắp xếp */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Sắp xếp</h3>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name-asc">Tên: A-Z</option>
                <option value="name-desc">Tên: Z-A</option>
              </select>
            </div>

            {/* Sizes */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Kích cỡ</h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-2 py-2 text-xs border rounded transition-colors whitespace-nowrap ${
                        selectedSizes.includes(size)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Khoảng giá */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Khoảng giá</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={priceRange.min || ''}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={priceRange.max === 1000000 ? '' : priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 1000000 }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {formatPrice(priceRange.min)} ₫ - {formatPrice(priceRange.max)} ₫
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Kết quả tìm kiếm: "{query}"
              </h1>
              <p className="text-gray-600">
                Tìm thấy {filteredProducts.length} sản phẩm
              </p>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            )}

            {/* No results */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-500 mb-4">
                  Không có sản phẩm nào phù hợp với từ khóa "{query}"
                </p>
                <button
                  onClick={handleClearSearch}
                  className="text-blue-600 hover:underline"
                >
                  Xóa tìm kiếm
                </button>
              </div>
            )}

            {/* Products grid */}
            {!isLoading && currentProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      title={product.title}
                      price={product.price}
                      images={product.images}
                      badges={product.badges}
                      onCardClick={() => navigate(`/product/${product.id}`)}
                      onAddToCart={() => {
                        console.log('Add to cart:', product.id);
                        alert(`Đã thêm "${product.title}" vào giỏ hàng!`);
                      }}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultPage;