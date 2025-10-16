export interface SubCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  subCategories: SubCategory[];
}

// Mock data 
export const getCategories = async (): Promise<Category[]> => {
  return [
    {
      id: 1,
      name: "NỮ",
      slug: "nu",
      subCategories: [
        { id: 101, name: "Áo thun", slug: "ao-thun" },
        { id: 102, name: "Áo sơ mi", slug: "ao-so-mi" },
        { id: 103, name: "Áo khoác", slug: "ao-khoac" },
      ],
    },
    {
      id: 2,
      name: "NAM",
      slug: "nam",
      subCategories: [
        { id: 201, name: "Áo thun", slug: "ao-thun" },
        { id: 202, name: "Quần jean", slug: "quan-jean" },
      ],
    },
    {
      id: 3,
      name: "BÉ GÁI",
      slug: "be-gai",
      subCategories: [
        { id: 301, name: "Váy", slug: "vay" },
        { id: 302, name: "Áo thun", slug: "ao-thun" },
      ],
    },
    {
      id: 4,
      name: "BÉ TRAI",
      slug: "be-trai",
      subCategories: [
        { id: 401, name: "Áo thun", slug: "ao-thun" },
        { id: 402, name: "Quần short", slug: "quan-short" },
      ],
    },
  ];
};
