import React from "react";
import { useParams } from "react-router-dom";

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Danh mục: {category}</h1>
      <div className="bg-white rounded shadow p-6">
        <p>Đây là trang hiển thị sản phẩm cho danh mục <span className="font-semibold">{category}</span>.</p>
        <p>(Có thể bổ sung logic fetch sản phẩm, filter, v.v. ở đây)</p>
      </div>
    </div>
  );
};

export default CategoryPage;
