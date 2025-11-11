"use client";
import Image from "next/image";

export default function Cityline() {
  return (
    <div className="relative w-full h-[224] flex justify-center bg-white overflow-hidden pb-4">
      <Image src="/cityline/full.png" alt="City line" fill priority />
    </div>
  );
}
