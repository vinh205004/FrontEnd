import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  const menuItems: string[] = [
    "SẢN PHẨM MỚI",
    "NỮ",
    "NAM",
    "BÉ GÁI",
    "BÉ TRAI",
    "CANIFA S",
    "SCHOOL",
    "GIẢI PHÁP THỜI TRANG",
  ];

  // Dữ liệu dropdown cho từng danh mục chính
  const dropdownMenus: Record<string, React.ReactNode> = {
    "NỮ": (
      <div className="bg-white text-[#3c474c] shadow-lg rounded-lg p-6 flex gap-8 min-w-[700px] border mt-2">
        <div>
          <h4 className="font-bold mb-2">DANH MỤC SẢN PHẨM</h4>
          <ul className="space-y-2">
            <li><Link to="/nu/ao-thun" className="hover:text-red-500">Áo phông / Áo thun</Link></li>
            <li><Link to="/nu/ao-polo" className="hover:text-red-500">Áo polo</Link></li>
            <li><Link to="/nu/ao-so-mi" className="hover:text-red-500">Áo sơ mi</Link></li>
            <li><Link to="/nu/do-ngu" className="hover:text-red-500">Đồ ngủ</Link></li>
          </ul>
        </div>
      </div>
    ),
    "NAM": (
      <div className="bg-white text-[#3c474c] shadow-lg rounded-lg p-6 flex gap-8 min-w-[700px] border mt-2">
        <div>
          <h4 className="font-bold mb-2">DANH MỤC SẢN PHẨM</h4>
          <ul className="space-y-2">
            <li><Link to="/nam/ao-thun" className="hover:text-red-500">Áo thun</Link></li>
            <li><Link to="/nam/quan-jean" className="hover:text-red-500">Quần jean</Link></li>
            <li><Link to="/nam/ao-khoac" className="hover:text-red-500">Áo khoác</Link></li>
          </ul>
        </div>
      </div>
    ),
    "BÉ GÁI": (
      <div className="bg-white text-[#3c474c] shadow-lg rounded-lg p-6 flex gap-8 min-w-[700px] border mt-2">
        <div>
          <h4 className="font-bold mb-2">DANH MỤC SẢN PHẨM</h4>
          <ul className="space-y-2">
            <li><Link to="/be-gai/ao-thun" className="hover:text-red-500">Áo phông / Áo thun</Link></li>
            <li><Link to="/be-gai/vay" className="hover:text-red-500">Váy</Link></li>
            <li><Link to="/be-gai/quan-short" className="hover:text-red-500">Quần short</Link></li>
          </ul>
        </div>
      </div>
    ),
    "BÉ TRAI": (
      <div className="bg-white text-[#3c474c] shadow-lg rounded-lg p-6 flex gap-8 min-w-[700px] border mt-2">
        <div>
          <h4 className="font-bold mb-2">DANH MỤC SẢN PHẨM</h4>
          <ul className="space-y-2">
            <li><Link to="/be-trai/ao-thun" className="hover:text-red-500">Áo thun</Link></li>
            <li><Link to="/be-trai/quan-short" className="hover:text-red-500">Quần short</Link></li>
            <li><Link to="/be-trai/ao-so-mi" className="hover:text-red-500">Áo sơ mi</Link></li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <nav className="w-full bg-[#3c474c] text-white relative">
      <ul className="max-w-7xl mx-auto flex items-center justify-around py-3 text-sm font-semibold">
        {menuItems.map((item) => (
          <li
            key={item}
            className="cursor-pointer transition-colors px-4 py-2 rounded hover:bg-white hover:text-[#3c474c] hover:font-bold relative"
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered(null)}
            style={{height: '100%'}}
          >
            <span style={{display: 'block', height: '100%'}}>{item}</span>
            {(hovered === item && dropdownMenus[item]) && (
              <div
                className="absolute left-0 top-full z-20 w-max"
                style={{marginTop: 0, minWidth: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0}}
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered(null)}
              >
                {dropdownMenus[item]}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
