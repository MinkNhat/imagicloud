"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const services = [
    {
      id: 1,
      title: "Chỉnh Sửa Hình Ảnh",
      subtitle: "Xoay, lật hoặc cắt ảnh để có được bố cục hoàn hảo",
      image: "/assets/images/edit.png",
      route: "/transformations/add/edit",
      buttonText: "Thử Ngay"
    },
    {
      id: 2,
      title: "Phục Hồi Hình Ảnh",
      subtitle: "Biến ký ức mờ nhạt trở nên rõ ràng, sống động chỉ trong tíc tắc",
      image: "/assets/images/restore.png",
      route: "/transformations/add/restore",
      buttonText: "Thử Ngay"
    },
    {
      id: 3,
      title: "Generative Fill",
      subtitle: "Tạo ra các chi tiết mới mẻ, liền mạch cho hình ảnh của bạn nhờ Cloudinary AI",
      image: "/assets/images/gene-fill.png",
      route: "/transformations/add/fill",
      buttonText: "Thử Ngay"
    },
    {
      id: 4,
      title: "Xóa Vật Thể",
      subtitle: "Xóa bỏ mọi vật thể không mong muốn trong ảnh, giữ lại khung hình đẹp như ý",
      image: "/assets/images/remove-object.png",
      route: "/transformations/add/remove",
      buttonText: "Thử Ngay"
    },
    {
      id: 5,
      title: "Thay Đổi Màu Vật Thể",
      subtitle: "Tùy chỉnh màu sắc chi tiết trong hình ảnh, tạo phong cách độc đáo và diện mạo mới mẻ",
      image: "/assets/images/recolor.png",
      route: "/transformations/add/recolor",
      buttonText: "Thử Ngay"
    },
    {
      id: 6,
      title: "Xóa Phông",
      subtitle: "Xóa phông nhanh chóng, chính xác, mang đến hình ảnh hoàn hảo trong vài giây",
      image: "/assets/images/remove-background.png",
      route: "/transformations/add/removeBackground",
      buttonText: "Thử Ngay"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl flex flex-col items-center justify-center h-[80vh]">
      <div className="relative overflow-hidden rounded-lg w-full">
        {/* Carousel container */}
        <div 
          className="flex transition-transform duration-500 ease-in-out" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {services.map((service) => (
            <div key={service.id} className="w-full flex-shrink-0">
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md h-full">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{service.title}</h2>
                <p className="text-center text-gray-600 mb-6">{service.subtitle}</p>
                
                <div className="w-full h-80 mb-6 overflow-hidden rounded-lg">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <button 
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => window.location.href = service.route}
                >
                  {service.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button 
          className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white" 
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>
        <button 
          className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white" 
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight />
        </button>
        
        {/* Indicators */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-2">
          {services.map((_, index) => (
            <button 
              key={index} 
              className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;