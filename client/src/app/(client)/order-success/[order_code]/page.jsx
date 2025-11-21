"use client";
import { useParams, useRouter } from "next/navigation";

export default function OrderSuccess() {
    const { order_code } = useParams();
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center text-center px-4 py-10">
            <h1 className="text-3xl font-bold text-green-600 mb-4">
                Đặt hàng thành công!
            </h1>
            <p className="text-gray-600 mb-2">
                Cảm ơn bạn đã đặt hàng. Đơn hàng <b>{order_code}</b> đang được
                xử lý.
            </p>
            <p className="text-gray-500 mb-6">
                Bộ phận giao hàng sẽ liên hệ với bạn sớm nhất để xác nhận đơn.
            </p>

            <button
                onClick={() => router.push("/")}
                className="px-10 py-3 bg-[#FC4126] hover:bg-[#ff6347] text-white font-semibold rounded-full shadow transition cursor-pointer
"
            >
                Quay lại trang chủ
            </button>
        </div>
    );
}
