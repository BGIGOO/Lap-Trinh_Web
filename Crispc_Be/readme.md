Gốc dự án

app.js: Lắp ráp app Express: nạp express.json(), mount routes/index.js, gắn error.js. Không mở cổng ở đây để test dễ.

server.js: File nhỏ nhoi chỉ app.listen(PORT). Giúp chạy, scale, test tách biệt.

config/

database.js: Tạo Sequelize instance (kết nối host/port/user/pass/db). Chỉ có 1 nơi cấu hình DB.

index.js: Load .env, các config chung (ví dụ JWT_ISSUER, JWT_AUDIENCE). Tập trung biến môi trường.

constants/

roles.js: Định nghĩa role ID/tên (CLIENT/EMPLOYEE/ADMIN). Tránh “magic number” rải rác khắp nơi.

permissions.js (tuỳ chọn): Nếu muốn mịn hơn role → permission cụ thể (user:read, order:create…), và map role → danh sách permission.

middleware/

auth.js: Xác thực JWT (“gác cổng”): đọc Authorization: Bearer <token>, jwt.verify, gắn req.user.

authorize.js: Phân quyền (RBAC). Hai biến thể:

requireRole(...roles): chỉ cho vai trò nhất định qua.

requirePerm(...perms): yêu cầu permission cụ thể.

error.js: Bộ thu lỗi trung tâm. Controller/Service chỉ cần throw, ở đây lo status/log/response.

models/

User.js: Định nghĩa bảng người dùng (user, accounts…). Cột: id/acc_id, username, password (hash), role_id…

Role.js (nếu có): Bảng role/permission quan hệ nhiều-nhiều, tuỳ thiết kế.

index.js: Nơi “kết bạn” giữa các model (associations), export sequelize & models.

services/

auth.service.js: Nghiệp vụ đăng nhập/đăng ký/refresh token. Nói chuyện trực tiếp với model (DB), xử lý bcrypt/JWT.

user.service.js: Nghiệp vụ về user (CRUD, đổi mật khẩu…), tách khỏi HTTP.

Services = “bộ não nghiệp vụ”, test unit rất dễ vì không phụ thuộc Express.

controllers/

auth.controller.js: Nhận request từ router, gọi auth.service, trả JSON, set status code. Không “đụng” DB trực tiếp.

user.controller.js: Tương tự cho user.

Controllers = “phiên dịch viên HTTP”: đọc body/param, gọi service, trả response.

routes/

auth.route.js: Khai báo endpoint public như /auth/login. Không lẫn logic nghiệp vụ.

users.route.js: Endpoint /users/*, gắn auth và authorize tại chỗ. Route = “bảng chỉ đường”.

index.js: Gom mọi router con vào /api.

utils/

jwt.js: Hàm signAccessToken, verifyAccessToken… để không phải viết lặp trong nhiều nơi.

asyncHandler.js: Wrapper bắt lỗi async cho controller (đỡ phải try/catch từng route).

password.js: bcrypt.compare, và (nếu cần) nhánh tạm “plain password” trong thời gian migrate.