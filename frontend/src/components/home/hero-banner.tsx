"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const banners = ["/baners/banner_1.jpg", "/baners/banner_2.jpg", "/baners/banner_3.jpg"];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[540px] overflow-hidden bg-gray-900">
      {banners.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`Rower Ok Banner ${i + 1}`}
          fill
          priority={i === 0}
          unoptimized
          className={`object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-black/35" />
      <div className="container relative z-10 mx-auto px-4 py-24">
        <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
          Find Your <span className="text-orange-500">Perfect Ride</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-200">Підбір велосипедів для міста, трейлу та шосе.</p>
      </div>
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
            aria-label={`Show banner ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
