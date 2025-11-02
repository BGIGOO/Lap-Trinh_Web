"use client";
import Image from "next/image";

export default function Cityline() {
  return (
    <div className="relative w-full flex justify-center bg-white overflow-hidden pb-4">
      <Image
        src="/cityline/full.png"
        alt="City line"
        width={1080}
        height={200}
        priority
        className="object-contain w-full max-h-[200px] select-none pointer-events-none"
      />
    </div>
  );
}
