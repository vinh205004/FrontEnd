import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getProductsByCategory } from "../services/mockProducts";
import type { ProductMock } from "../services/mockProducts";
import { getCategories } from "../services/categoryService";
import type { Category } from "../services/categoryService";
import ProductCard from "../components/ProductCard";

const CategoryPage: React.FC = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState<ProductMock[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PRODUCTS_PER_PAGE = 12;

  // Filters - Sync with URL params
  const [selectedSizes, setSelectedSizes] = useState<string[]>(() => {
    const sizesParam = searchParams.get('sizes');
    return sizesParam ? sizesParam.split(',') : [];
  });
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(subcategory || null);
  
  const [sortBy, setSortBy] = useState<string>(() => searchParams.get('sort') || 'default');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: Number(searchParams.get('minPrice')) || 0,
    max: Number(searchParams.get('maxPrice')) || 1000000
  });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000000
  });

  // Dynamic sizes based on category
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Không thể tải danh mục");
      }
    };
    loadCategories();
  }, []);

  // Sync selectedSubCategory with URL parameter
  useEffect(() => {
    setSelectedSubCategory(subcategory || null);
    setCurrentPage(1); // Reset page when subcategory changes
    window.scrollTo(0, 0);
  }, [subcategory]);

  // Sync filters with URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    
    if (selectedSizes.length > 0) {
      params.sizes = selectedSizes.join(',');
    }
    if (sortBy !== 'default') {
      params.sort = sortBy;
    }
    if (priceRange.min > 0) {
      params.minPrice = priceRange.min.toString();
    }
    if (priceRange.max < 10000000) {
      params.maxPrice = priceRange.max.toString();
    }

    setSearchParams(params, { replace: true });
  }, [selectedSizes, sortBy, priceRange, setSearchParams]);

  // Load products
  const loadProducts = useCallback(async (page: number = 1, append: boolean = false) => {
    if (!category || categories.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // Find the category name from slug
      const currentCategoryData = categories.find(cat => cat.slug === category);
      if (!currentCategoryData) {
        throw new Error("Danh mục không tồn tại");
      }
      
      const categoryName = currentCategoryData.name;
      let allProducts: ProductMock[];
      
      // Check if selectedSubCategory exists in current category
      const subCategoryExists = currentCategoryData.subCategories.some(
        sub => sub.slug === selectedSubCategory
      );
      
      if (selectedSubCategory && subCategoryExists) {
        // Load products by subcategory
        const allCategoryProducts = await getProductsByCategory(categoryName);
        allProducts = allCategoryProducts.filter(
          product => product.subCategory === selectedSubCategory
        );
        console.log(`Loading subcategory "${selectedSubCategory}":`, allProducts.length, 'products');
      } else {
        // Load products by category
        if (selectedSubCategory && !subCategoryExists) {
          setSelectedSubCategory(null);
        }
        // TODO: Replace with actual API call that supports pagination
        // const response = await fetch(`/api/products?category=${categoryName}&page=${page}&limit=${PRODUCTS_PER_PAGE}`);
        allProducts = await getProductsByCategory(categoryName);
      }

      // Apply filters (this should be done on backend in production)
      let filteredProducts = allProducts;

      // Filter by size
      if (selectedSizes.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          product.sizes?.some(size => selectedSizes.includes(size))
        );
      }

      // Filter by price range
      filteredProducts = filteredProducts.filter(product => 
        product.price >= priceRange.min && product.price <= priceRange.max
      );

      // Sort products
      switch (sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name-desc':
          filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'newest':
          // Assuming products have a createdAt field
          // filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          break;
      }

      // Pagination (client-side for now, should be server-side)
      const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      setTotalProducts(filteredProducts.length);
      setHasMore(endIndex < filteredProducts.length);

      if (append) {
        setProducts(prev => [...prev, ...paginatedProducts]);
      } else {
        setProducts(paginatedProducts);
      }

    } catch (err) {
      console.error("Error loading products:", err);
      setError(err instanceof Error ? err.message : "Không thể tải sản phẩm");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, selectedSubCategory, categories, selectedSizes, sortBy, priceRange]);

  // Load products when dependencies change
  useEffect(() => {
    setCurrentPage(1);
    loadProducts(1, false);
  }, [loadProducts]);

  // Extract available sizes from current products
  useEffect(() => {
    const loadAvailableSizes = async () => {
      if (!category || categories.length === 0) return;

      try {
        const currentCategoryData = categories.find(cat => cat.slug === category);
        if (!currentCategoryData) return;

        const categoryName = currentCategoryData.name;
        const allCategoryProducts = await getProductsByCategory(categoryName);
        
        // Extract all unique sizes from category products
        const allSizes = new Set<string>();
        allCategoryProducts.forEach(product => {
          product.sizes?.forEach(size => allSizes.add(size));
        });
        
        setAvailableSizes(Array.from(allSizes).sort());
      } catch (error) {
        console.error("Error loading available sizes:", error);
        setAvailableSizes(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
      }
    };

    loadAvailableSizes();
  }, [category, categories]);

  // Handlers
  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
    setCurrentPage(1); // Reset to first page
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadProducts(nextPage, true);
  };

  const handleCategoryClick = () => {
    setSelectedSubCategory(null);
    setCurrentPage(1);
    navigate(`/${category}`);
  };

  const handleClearFilters = () => {
    setSelectedSizes([]);
    setSortBy('default');
    setPriceRange({ min: 0, max: 1000000 });
    setTempPriceRange({ min: 0, max: 1000000 });
    setCurrentPage(1);
  };

  const handleApplyPriceFilter = () => {
    setPriceRange(tempPriceRange);
    setCurrentPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const currentCategory = categories.find(cat => cat.slug === category);

  // Loading skeleton
  if (isLoading && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex gap-8">
          <div className="w-1/4 bg-white rounded-lg shadow-sm p-6 h-96 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => loadProducts(1, false)}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-1/4 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-4">
          {/* Active filters count */}
          {(selectedSizes.length > 0 || sortBy !== 'default' || priceRange.min > 0 || priceRange.max < 1000000) && (
            <div className="mb-4 flex items-center justify-between bg-blue-50 p-3 rounded">
              <span className="text-sm text-blue-800">
                {selectedSizes.length + (sortBy !== 'default' ? 1 : 0) + (priceRange.min > 0 || priceRange.max < 1000000 ? 1 : 0)} bộ lọc đang áp dụng
              </span>
              <button 
                onClick={handleClearFilters}
                className="text-xs text-blue-600 hover:underline"
              >
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Danh mục sản phẩm */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Danh mục sản phẩm</h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="space-y-2">
              <div
                className={`cursor-pointer py-2 px-3 rounded transition-colors ${
                  !selectedSubCategory
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'hover:bg-gray-50'
                }`}
                onClick={handleCategoryClick}
              >
                Tất cả
              </div>
              
              {currentCategory?.subCategories.map((sub) => (
                <div
                  key={sub.id}
                  className={`cursor-pointer py-2 px-3 rounded transition-colors ${
                    selectedSubCategory === sub.slug
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedSubCategory(sub.slug);
                    setCurrentPage(1);
                    navigate(`/${category}/${sub.slug}`);
                  }}
                >
                  {sub.name}
                </div>
              ))}
            </div>
          </div>

          {/* Sắp xếp */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Sắp xếp</h3>
            </div>
            <select 
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="name-asc">Tên: A-Z</option>
              <option value="name-desc">Tên: Z-A</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>

          {/* Kích cỡ */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Kích cỡ</h3>
              {selectedSizes.length > 0 && (
                <span className="text-xs text-gray-500">({selectedSizes.length})</span>
              )}
            </div>
            {availableSizes.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSizes.map((size: string) => (
                  <button
                    key={size}
                    className={`px-2 py-2 text-xs border rounded transition-colors whitespace-nowrap ${
                      selectedSizes.includes(size)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Đang tải...</p>
            )}
          </div>

          {/* Khoảng giá */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Khoảng giá</h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Price inputs */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Từ"
                  value={tempPriceRange.min || ''}
                  onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={tempPriceRange.max === 1000000 ? '' : tempPriceRange.max}
                  onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 1000000 }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              </div>

              {/* Price range slider */}
              <div className="px-1">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={tempPriceRange.max}
                  onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatPrice(tempPriceRange.min)} ₫</span>
                  <span>{formatPrice(tempPriceRange.max)} ₫</span>
                </div>
              </div>

              {/* Apply button */}
              <button
                onClick={handleApplyPriceFilter}
                className="w-full bg-gray-800 text-white py-2 text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {currentCategory?.name} - {selectedSubCategory 
                ? currentCategory?.subCategories.find(sub => sub.slug === selectedSubCategory)?.name || selectedSubCategory 
                : 'Tất cả'}
            </h1>
            <p className="text-gray-600">
              Hiển thị {products.length} / {totalProducts} sản phẩm
            </p>
          </div>

          {/* No products found */}
          {!isLoading && products.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
              <button 
                onClick={handleClearFilters}
                className="text-blue-600 hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Product Grid */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  images={product.images}
                  badges={product.badges}
                  onCardClick={() => navigate(`/product/${product.id}`)}
                  onAddToCart={() => {
                    // TODO: Implement add to cart logic
                    console.log('Add to cart:', product.id);
                    // Example: addToCart(product.id);
                  }}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && products.length > 0 && (
            <div className="text-center mt-8">
              <button 
                onClick={handleLoadMore}
                disabled={isLoading}
                className="bg-gray-800 text-white px-8 py-3 rounded hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
              </button>
            </div>
          )}

          {/* Loading more indicator */}
          {isLoading && products.length > 0 && (
            <div className="text-center mt-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;