import React from "react";
import Slider from "react-slick";
import { FaQuoteLeft } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "Samantha Blake",
    role: "HR Director",
    text: "Protopia transformed how we assess leadership. It's insightful and futuristic.",
  },
  {
    name: "Rajiv Patel",
    role: "Team Coach",
    text: "The AI-driven insights helped my team align with ethical leadership values.",
  },
  {
    name: "Emily Wong",
    role: "Compliance Manager",
    text: "No more guesswork — we finally have measurable leadership behaviors.",
  },
];

const TestimonialsCarousel = () => {
  const settings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className="py-20 bg-gradient-to-t from-gray-100 to-pink-50 text-center">
      <h2 className="text-3xl font-bold text-indigo-700 mb-10">What Leaders Are Saying</h2>
      <div className="max-w-3xl mx-auto px-4">
        <Slider {...settings}>
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 bg-white rounded-lg border border-gray-200 shadow">
              <FaQuoteLeft className="text-indigo-500 text-2xl mb-4 mx-auto" />
              <p className="italic text-gray-700 mb-4">“{t.text}”</p>
              <p className="font-semibold text-indigo-700">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
