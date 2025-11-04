export default function AchievementSection() {
  return (
    <section className="bg-[#FC4126] py-16 px-4 text-white text-center">
      <div className="max-w-6xl mx-auto">
        {/* TIÊU ĐỀ */}
        <h2 className="text-3xl md:text-4xl font-extrabold uppercase mb-10">
          Thành tựu của CrispC
        </h2>

        {/* KHUNG TRẮNG */}
        <div className="bg-white text-[#FC4126] rounded-[32px] p-10 md:p-14 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-8 text-center">
            {/* CỘT 1 */}
            <div>
              <h3 className="text-4xl font-extrabold mb-2">2020</h3>
              <p className="text-sm md:text-base leading-relaxed">
                Crisp chính thức ra mắt, mô hình cửa hàng đồ ăn nhanh hiện đại,{" "}
                <br />
                bắt trọn xu hướng.
              </p>
            </div>

            {/* CỘT 2 */}
            <div>
              <h3 className="text-4xl font-extrabold mb-2">3</h3>
              <p className="text-sm md:text-base leading-relaxed">
                Năm liên tiếp giành giải <br />
                <strong>"Thương hiệu Tăng trưởng Nhanh nhất"</strong> trong
                ngành F&B.
              </p>
            </div>

            {/* CỘT 3 */}
            <div>
              <h3 className="text-4xl font-extrabold mb-2">10</h3>
              <p className="text-sm md:text-base leading-relaxed">
                Cửa hàng quốc tế tại 3 quốc gia, đánh dấu bước tiến thần tốc ra
                thị trường toàn cầu.
              </p>
            </div>

            {/* CỘT 4 */}
            <div>
              <h3 className="text-4xl font-extrabold mb-2">75</h3>
              <p className="text-sm md:text-base leading-relaxed">
                Cửa hàng trên khắp Việt Nam, đạt được chỉ sau 5 năm hoạt động.{" "}
                <br />
                (Tính đến năm 2025)
              </p>
            </div>

            {/* CỘT 5 */}
            <div>
              <h3 className="text-4xl font-extrabold mb-2">97%</h3>
              <p className="text-sm md:text-base leading-relaxed">
                Tỷ lệ khách hàng hài lòng. <br />
                Chất lượng là chìa khóa cho sự phát triển của chúng tôi.
              </p>
            </div>

            {/* CỘT 6 */}
            <div>
              <h3 className="text-4xl font-extrabold mb-2">3 triệu</h3>
              <p className="text-sm md:text-base leading-relaxed">
                Lượt tải ứng dụng. <br />
                Khẳng định vị thế thương hiệu F&B hàng đầu trong kỷ nguyên số.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
