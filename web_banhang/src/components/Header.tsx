import { useRef } from "react";
import Slider from "react-slick";
import { ShoppingBag, User, Store, ChevronLeft, ChevronRight } from "lucide-react";
import logo from "../assets/logo.PNG";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Header: React.FC = () => {
  const sliderRef = useRef<Slider | null>(null);

  const messages = [
    "ĐỔI HÀNG MIỄN PHÍ - TẠI TẤT CẢ CỬA HÀNG TRONG 30 NGÀY",
    "THÊM VÀO GIỎ 300.000 ₫ ĐỂ MIỄN PHÍ VẬN CHUYỂN",
    "ƯU ĐÃI LÊN ĐẾN 50% CHO THÀNH VIÊN MỚI 🎉",
  ];

  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    arrows: false,
    dots: false,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    swipe: false,
    fade: false,
    cssEase: "ease-in-out",
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Thanh chạy chữ Carousel */}
      <div className="relative w-full bg-[#f5f7fa] border-b overflow-hidden">
        <Slider ref={sliderRef} {...settings}>
          {messages.map((msg, index) => (
            <div key={index}>
              <p className="text-center py-2 font-medium text-[#3c474c] text-sm tracking-wide">
                {msg}
              </p>
            </div>
          ))}
        </Slider>

        {/* Nút điều khiển trái/phải */}
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Header chính */}
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <img src={logo} alt="Canifa" className="w-24 cursor-pointer" />
          </Link>
        </div>

        {/* Ô tìm kiếm - Thay thế bằng SearchBar component */}
        <div className="w-1/2">
          <SearchBar />
        </div>

        {/* Các icon */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-center cursor-pointer">
            <Store size={22} />
            <span>Cửa hàng</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <Link to="/login" className="flex flex-col items-center">
              <User size={22} />
              <span>Tài khoản</span>
            </Link>
          </div>
          <div className="relative flex flex-col items-center cursor-pointer">
            <ShoppingBag size={22} />
            <span>Giỏ hàng</span>
            <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;