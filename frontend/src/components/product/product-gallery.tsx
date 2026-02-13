"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type GalleryImage = {
  id: number;
  image: string;
  is_main: boolean;
  alt_text: string;
};

type Props = {
  images?: GalleryImage[];
  productName: string;
};

export default function ProductGallery({ images, productName }: Props) {
  const normalizedImages = useMemo(() => {
    const list = images ?? [];
    const sorted = [...list].sort((a, b) => Number(b.is_main) - Number(a.is_main));
    return sorted;
  }, [images]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const selected = normalizedImages[selectedIndex];

  if (!selected) {
    return <div className="aspect-[4/3] rounded-2xl bg-gray-100" />;
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100"
      >
        <Image src={selected.image} alt={selected.alt_text || productName} fill className="object-cover" />
      </button>
      <div className="grid grid-cols-4 gap-3">
        {normalizedImages.slice(0, 12).map((img, idx) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 ${
              idx === selectedIndex ? "ring-2 ring-brand" : ""
            }`}
          >
            <Image src={img.image} alt={img.alt_text || productName} fill className="object-cover" />
          </button>
        ))}
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setIsOpen(false)}>
          <div className="relative h-[80vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image src={selected.image} alt={selected.alt_text || productName} fill className="object-contain" />
            <button
              type="button"
              className="absolute right-2 top-2 rounded bg-white/90 px-3 py-1 text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
