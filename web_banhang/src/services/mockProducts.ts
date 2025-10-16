export interface ProductMock {
  id: number;
  title: string;
  price: number;
  images: string[];
  badges?: string[];
  category?: string;
  subCategory?: string;
  sizes?: string[];
}

// Hàm xáo trộn mảng (Fisher-Yates shuffle)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const mockProducts: ProductMock[] = [
  // NỮ - Áo thun
  {
    id: 1,
    title: "Áo thun nữ basic cổ tròn",
    price: 199000,
    images: ["/src/assets/product1-1.webp", "/src/assets/product1-2.webp"],
    badges: ["Freeship"],
    category: "NỮ",
    subCategory: "ao-thun",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    title: "Áo thun nữ oversize họa tiết",
    price: 249000,
    images: ["/src/assets/product2-1.webp"],
    badges: ["Hàng mới"],
    category: "NỮ",
    subCategory: "ao-thun",
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    id: 3,
    title: "Áo thun nữ crop top",
    price: 179000,
    images: ["/src/assets/product3-1.webp"],
    category: "NỮ",
    subCategory: "ao-thun",
    sizes: ["XS", "S", "M", "L"],
  },

  // NỮ - Áo sơ mi
  {
    id: 4,
    title: "Áo sơ mi nữ trắng công sở",
    price: 399000,
    images: ["/src/assets/product4-1.webp"],
    badges: ["Freeship"],
    category: "NỮ",
    subCategory: "ao-so-mi",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 5,
    title: "Áo sơ mi nữ kẻ sọc",
    price: 449000,
    images: ["/src/assets/product5-1.webp"],
    category: "NỮ",
    subCategory: "ao-so-mi",
    sizes: ["M", "L", "XL"],
  },

  // NỮ - Áo khoác
  {
    id: 6,
    title: "Áo khoác nữ blazer",
    price: 699000,
    images: ["/src/assets/product6-1.webp"],
    badges: ["Hàng mới"],
    category: "NỮ",
    subCategory: "ao-khoac",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 7,
    title: "Áo khoác nữ denim",
    price: 549000,
    images: ["/src/assets/product7-1.webp"],
    category: "NỮ",
    subCategory: "ao-khoac",
    sizes: ["M", "L", "XL"],
  },

  // NAM - Áo thun
  {
    id: 8,
    title: "Áo thun nam basic cotton",
    price: 179000,
    images: ["/src/assets/product8-1.webp"],
    badges: ["Freeship"],
    category: "NAM",
    subCategory: "ao-thun",
    sizes: ["M", "L", "XL", "XXL", "XXXL"],
  },
  {
    id: 9,
    title: "Áo thun nam polo",
    price: 299000,
    images: ["/src/assets/product9-1.webp"],
    category: "NAM",
    subCategory: "ao-thun",
    sizes: ["L", "XL", "XXL"],
  },
  {
    id: 10,
    title: "Áo thun nam tank top",
    price: 149000,
    images: ["/src/assets/product10-1.webp"],
    category: "NAM",
    subCategory: "ao-thun",
    sizes: ["M", "L", "XL"],
  },

  // NAM - Quần jean
  {
    id: 11,
    title: "Quần jean nam slim fit",
    price: 499000,
    images: ["/src/assets/product11-1.webp"],
    badges: ["Hàng mới"],
    category: "NAM",
    subCategory: "quan-jean",
    sizes: ["29", "30", "31", "32", "33", "34"],
  },
  {
    id: 12,
    title: "Quần jean nam straight fit",
    price: 449000,
    images: ["/src/assets/product12-1.webp"],
    category: "NAM",
    subCategory: "quan-jean",
    sizes: ["30", "31", "32", "33", "34"],
  },
  {
    id: 13,
    title: "Quần jean nam skinny",
    price: 399000,
    images: ["/src/assets/product13-1.webp"],
    category: "NAM",
    subCategory: "quan-jean",
    sizes: ["28", "29", "30", "31", "32"],
  },

  // BÉ GÁI - Váy
  {
    id: 14,
    title: "Váy bé gái hoa nhí",
    price: 299000,
    images: ["/src/assets/product14-1.webp"],
    badges: ["Freeship"],
    category: "BÉ GÁI",
    subCategory: "vay",
    sizes: ["2-3 tuổi", "4-5 tuổi", "6-7 tuổi"],
  },
  {
    id: 15,
    title: "Váy bé gái công chúa",
    price: 399000,
    images: ["/src/assets/product15-1.webp"],
    category: "BÉ GÁI",
    subCategory: "vay",
    sizes: ["3-4 tuổi", "5-6 tuổi", "7-8 tuổi"],
  },

  // BÉ GÁI - Áo thun
  {
    id: 16,
    title: "Áo thun bé gái hình thú",
    price: 149000,
    images: ["/src/assets/product16-1.webp"],
    category: "BÉ GÁI",
    subCategory: "ao-thun",
    sizes: ["2-3 tuổi", "4-5 tuổi", "6-7 tuổi", "8-9 tuổi"],
  },
  {
    id: 17,
    title: "Áo thun bé gái họa tiết",
    price: 179000,
    images: ["/src/assets/product17-1.webp"],
    badges: ["Hàng mới"],
    category: "BÉ GÁI",
    subCategory: "ao-thun",
    sizes: ["3-4 tuổi", "5-6 tuổi", "7-8 tuổi"],
  },

  // BÉ TRAI - Áo thun
  {
    id: 18,
    title: "Áo thun bé trai siêu anh hùng",
    price: 199000,
    images: ["/src/assets/product18-1.webp"],
    category: "BÉ TRAI",
    subCategory: "ao-thun",
    sizes: ["2-3 tuổi", "4-5 tuổi", "6-7 tuổi", "8-9 tuổi"],
  },
  {
    id: 19,
    title: "Áo thun bé trai xe hơi",
    price: 179000,
    images: ["/src/assets/product19-1.webp"],
    badges: ["Freeship"],
    category: "BÉ TRAI",
    subCategory: "ao-thun",
    sizes: ["3-4 tuổi", "5-6 tuổi", "7-8 tuổi"],
  },

  // BÉ TRAI - Quần short
  {
    id: 20,
    title: "Quần short bé trai thể thao",
    price: 249000,
    images: ["/src/assets/product20-1.webp"],
    category: "BÉ TRAI",
    subCategory: "quan-short",
    sizes: ["2-3 tuổi", "4-5 tuổi", "6-7 tuổi"],
  },
  {
    id: 21,
    title: "Quần short bé trai jean",
    price: 299000,
    images: ["/src/assets/product21-1.webp"],
    badges: ["Hàng mới"],
    category: "BÉ TRAI",
    subCategory: "quan-short",
    sizes: ["4-5 tuổi", "6-7 tuổi", "8-9 tuổi"],
  },

  {
    id: 22,
    title: "Áo khoác nữ hoodie",
    price: 549000,
    images: ["/src/assets/product22-1.webp"],
    category: "NỮ",
    subCategory: "ao-khoac",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 23,
    title: "Áo sơ mi nam kẻ caro",
    price: 399000,
    images: ["/src/assets/product23-1.webp"],
    badges: ["Freeship"],
    category: "NAM",
    subCategory: "ao-thun",
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    id: 24,
    title: "Váy bé gái dự tiệc",
    price: 599000,
    images: ["/src/assets/product24-1.webp"],
    category: "BÉ GÁI",
    subCategory: "vay",
    sizes: ["3-4 tuổi", "5-6 tuổi", "7-8 tuổi", "9-10 tuổi"],
  },
  {
    id: 25,
    title: "Quần short bé trai kaki",
    price: 269000,
    images: ["/src/assets/product25-1.webp"],
    category: "BÉ TRAI",
    subCategory: "quan-short",
    sizes: ["3-4 tuổi", "5-6 tuổi", "7-8 tuổi"],
  }
];

export const getNewProducts = async () => {
  // Trả về 8 sản phẩm ngẫu nhiên từ tất cả sản phẩm
  const shuffledProducts = shuffleArray(mockProducts);
  return Promise.resolve(shuffledProducts.slice(0, 8));
};

export const getAllProducts = async () => {
  return Promise.resolve(mockProducts);
};

export const getProductsByCategory = async (category: string) => {
  return Promise.resolve(mockProducts.filter(product => product.category === category));
};

export const getRandomProductsByCategory = async (category: string, count: number = 8) => {
  const categoryProducts = mockProducts.filter(product => product.category === category);
  const shuffledProducts = shuffleArray(categoryProducts);
  return Promise.resolve(shuffledProducts.slice(0, count));
};

export const getProductsBySubCategory = async (subCategory: string) => {
  return Promise.resolve(mockProducts.filter(product => product.subCategory === subCategory));
};

export const getProductById = async (id: number) => {
  return Promise.resolve(mockProducts.find(product => product.id === id));
};