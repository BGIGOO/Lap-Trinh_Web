"use client";
import { useState, useEffect } from "react";
import { Search, MapPin, X } from "lucide-react";
import axios from "axios";

export default function AddressPopup({ open, onClose, onSelect }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selected, setSelected] = useState(null);
    const [distance, setDistance] = useState(null);
    const [error, setError] = useState("");

    // 🏪 Tọa độ cửa hàng cố định (ví dụ: Trường Chinh - Tân Bình)
    const STORE_LOCATION = { lat: 10.8061, lon: 106.6368 };

    // 🧠 Khi mở popup -> đọc địa chỉ đã lưu từ localStorage
    useEffect(() => {
        if (open) {
            const saved = localStorage.getItem("address");
            if (saved) {
                const addr = JSON.parse(saved);
                setSelected(addr);
                setQuery(addr.name);
            }
        }
    }, [open]);

    // 📍 Gợi ý địa chỉ từ OpenStreetMap
    useEffect(() => {
        if (query.length < 3) return setSuggestions([]);
        const timeout = setTimeout(async () => {
            try {
                const res = await axios.get("https://nominatim.openstreetmap.org/search", {
                    params: {
                        q: query,
                        format: "json",
                        addressdetails: 1,
                        countrycodes: "VN",
                        limit: 5,
                    },
                });
                setSuggestions(res.data);
            } catch (err) {
                console.error("Lỗi tìm địa chỉ:", err);
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [query]);

    // 🔢 Tính khoảng cách (Haversine)
    const calcDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
                Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // ✅ Khi người dùng chọn 1 gợi ý
    const handleSelect = (sug) => {
        const dist = calcDistance(
            STORE_LOCATION.lat,
            STORE_LOCATION.lon,
            parseFloat(sug.lat),
            parseFloat(sug.lon)
        );

        const addr = {
            name: sug.display_name,
            lat: parseFloat(sug.lat),
            lon: parseFloat(sug.lon),
        };

        setSelected(addr);
        setDistance(dist.toFixed(2));
        setError(dist <= 10 ? "" : "Ngoài phạm vi giao hàng (chỉ trong 10km)");
        setSuggestions([]);
        setQuery(sug.display_name);
    };

    // 🧾 Khi xác nhận
    const handleConfirm = () => {
        if (!selected) return;
        if (distance > 10) {
            setError("Ngoài phạm vi giao hàng (chỉ trong 10km)");
            return;
        }

        // 💾 Lưu địa chỉ vào localStorage
        localStorage.setItem("address", JSON.stringify(selected));

        // Truyền lại cho component cha
        onSelect(selected);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-[90%] md:w-[500px] p-6 relative">
                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-[#FC4126]"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-[#FC4126] mb-4">
                    Nhập địa chỉ giao hàng của bạn
                </h2>

                {/* Ô nhập */}
                <div className="flex items-center border border-[#FC4126] rounded-full overflow-hidden mb-3">
                    <Search className="mx-2 text-[#FC4126]" size={18} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ví dụ: 360 Trường Chinh, Tân Bình"
                        className="flex-1 py-2 text-sm outline-none"
                    />
                </div>

                {/* Danh sách gợi ý */}
                {suggestions.length > 0 && (
                    <div className="bg-white border border-[#FC4126]/30 rounded-lg shadow p-2 mb-3 max-h-[150px] overflow-auto text-sm">
                        {suggestions.map((s, i) => (
                            <div
                                key={i}
                                onClick={() => handleSelect(s)}
                                className="cursor-pointer px-2 py-1 hover:bg-[#FC4126]/10 rounded"
                            >
                                <MapPin className="inline mr-1 text-[#FC4126]" size={14} />
                                {s.display_name}
                            </div>
                        ))}
                    </div>
                )}

                {/* Thông tin địa chỉ đã chọn */}
                {selected && (
                    <div className="text-sm text-gray-700 mb-3">
                        <p><b>Địa chỉ:</b> {selected.name}</p>
                        {distance && (
                            <p>🚗 <b>Khoảng cách:</b> {distance} km</p>
                        )}
                    </div>
                )}

                {/* Cảnh báo */}
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                {/* Nút xác nhận */}
                <button
                    onClick={handleConfirm}
                    disabled={!selected}
                    className={`w-full py-2 rounded-full font-semibold text-white transition ${
                        selected
                            ? "bg-[#FC4126] hover:bg-[#ff6347]"
                            : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                    Xác nhận địa chỉ
                </button>
            </div>
        </div>
    );
}
