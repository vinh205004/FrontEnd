import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getVouchers } from "../../services/voucherService";
import type { Voucher } from "../../services/voucherService";
import { getNewProducts, getRandomProductsByCategory } from "../../services/mockProducts";
import type { ProductMock } from "../../services/mockProducts";
import ProductCard from "../../components/ProductCard";

import banner1 from "../../assets/banner1.webp";
import banner2 from "../../assets/banner2.webp";
import banner3 from "../../assets/banner3.webp";
import banner4 from "../../assets/banner4.webp";
import banner5 from "../../assets/banner5.webp";

const Home: React.FC = () => {
  const slides = [banner1, banner2, banner3, banner4, banner5];
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [products, setProducts] = useState<ProductMock[]>([]);
  const [filter, setFilter] = useState<string>("Tất cả");

  useEffect(() => {
    let mounted = true;
    getVouchers().then((data) => {
      if (mounted) setVouchers(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Load sản phẩm theo filter
  useEffect(() => {
    let mounted = true;
    
    const loadProducts = async () => {
      try {
        let data: ProductMock[];
        if (filter === "Tất cả") {
          data = await getNewProducts();
        } else {
          data = await getRandomProductsByCategory(filter, 8);
        }
        if (mounted) setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    
    loadProducts();
    
    return () => {
      mounted = false;
    };
  }, [filter]);

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="w-full h-[505px]"
      >
        {slides.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`slide-${index}`}
              className="w-full h-auto object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* === ƯU ĐÃI NỔI BẬT === */}
      <section className="max-w-7xl mx-auto my-10 px-6">
        <h2 className="text-3xl font-extrabold text-[#274151] mb-6 text-center">
          ƯU ĐÃI NỔI BẬT
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
          {vouchers.map((v) => (
            <div key={v.id} className="w-full max-w-xl border rounded-md p-6 bg-white shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{v.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <div>HSD: {v.expiredAt}</div>
                  <div className="font-semibold mt-2">{v.condition}</div>
                </div>
                <button className="bg-[#3c474c] text-white px-4 py-2 rounded">Dùng mã</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === SẢN PHẨM MỚI === */}
      <section className="max-w-7xl mx-auto my-12 px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-[#274151]">SẢN PHẨM MỚI</h2>
          <div className="text-sm text-gray-600 flex items-center gap-4">
            <button className="text-sm text-gray-500">XEM THÊM →</button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          {['Tất cả','NỮ','NAM','BÉ GÁI','BÉ TRAI'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 border rounded text-sm ${filter===f? 'bg-[#374151] text-white':''}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative">
          {/* custom navigation buttons */}
          <button className="custom-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded shadow flex items-center justify-center border">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 6L9 12L15 18" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="custom-next absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded shadow flex items-center justify-center border">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="py-4"
          >
            {products.map((p) => (
                <SwiperSlide key={p.id}>
                  <ProductCard
                    title={p.title}
                    price={p.price}
                    images={p.images}
                    badges={p.badges}
                    onCardClick={() => navigate(`/product/${p.id}`)}
                    onAddToCart={() => {
                      /* placeholder: thêm xử lý khi cần */
                    }}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default Home;
