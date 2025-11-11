export default function Pagination({
    page,
    totalPages,
    onChange,
    maxButtons = 6,
}) {
    const go = (p) => {
        if (p < 1 || p > totalPages || p === page) return;
        onChange(p);
    };

    const items = buildItems(page, totalPages, maxButtons);
    console.log(items);

    return (
        <nav className="mt-6 flex items-center justify-center gap-2 select-none">
            <button
                onClick={() => go(page - 1)}
                disabled={page === 1}
                className={`px-4 h-9 rounded-full text-white font-semibold transition
          ${
              page === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#FF8A00] hover:bg-[#FFA33A]"
          }`}
                aria-label="Trang trước"
            >
                Prev
            </button>

            {items.map((it, idx) =>
                typeof it === "number" ? (
                    <button
                        key={it}
                        onClick={() => go(it)}
                        aria-current={it === page ? "page" : undefined}
                        className={`w-9 h-9 rounded-full text-white font-semibold transition cursor-pointer
              ${
                  it === page ? "bg-[#FF8A00]" : "bg-gray-300 hover:bg-gray-400"
              }`}
                    >
                        {it}
                    </button>
                ) : (
                    <span
                        key={`dots-${idx}`}
                        className="w-9 h-9 grid place-items-center text-gray-400"
                    >
                        …
                    </span>
                )
            )}

            <button
                onClick={() => go(page + 1)}
                disabled={page === totalPages}
                className={`px-4 h-9 rounded-full text-white font-semibold transition cursor-pointer
          ${
              page === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#FF8A00] hover:bg-[#FFA33A]"
          }`}
                aria-label="Trang sau"
            >
                Next
            </button>
        </nav>
    );
}

function buildItems(page, totalPages, maxButtons) {
    // ít trang -> hiện hết
    if (totalPages <= maxButtons) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items = [1];
    const windowSize = Math.max(1, maxButtons - 2); // phần giữa (trừ 1 & last)

    // tính dải giữa quanh trang hiện tại
    let start = Math.max(2, page - Math.floor(windowSize / 2));
    let end = Math.min(totalPages - 1, start + windowSize - 1);

    // đảm bảo đủ windowSize khi gần cuối
    start = Math.max(2, Math.min(start, totalPages - 1 - (windowSize - 1)));
    end = Math.min(totalPages - 1, start + windowSize - 1);

    if (start > 2) items.push("dots-left");
    for (let p = start; p <= end; p++) items.push(p);
    if (end < totalPages - 1) items.push("dots-right");

    items.push(totalPages);
    return items;
}
