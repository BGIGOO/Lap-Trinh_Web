import Image from "next/image";
import Link from "next/link";

export default function MenuSection() {
  return (
    <section>
      <div className="flex justify-center gap-15 overflow-x-auto px-6 pb-10">
        {/* Ảnh 1 */}
        <div className="relative w-[241px] h-[366px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/Menu_Section/MenuLine_1.png"
            alt="Menu Line 1"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Ảnh 2 */}
        <div className="relative w-[229px] h-[272px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/Menu_Section/MenuLine_2.png"
            alt="Menu Line 2"
            fill
            className="object-cover "
          />
        </div>

        {/* Ảnh 3 */}
        <div className="relative w-[230px] h-[366px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/Menu_Section/MenuLine_3.png"
            alt="Menu Line 3"
            fill
            className="object-cover"
          />
        </div>

        {/* Ảnh 4 */}
        <div className="relative w-[230px] h-[272px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/Menu_Section/MenuLine_4.png"
            alt="Menu Line 4"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        {/* Ảnh 5 */}
        <div className="relative w-[230px] h-[366px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/Menu_Section/MenuLine_5.png"
            alt="Menu Line 5"
            fill
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
