import jwt from "jsonwebtoken";

const SECRET = "mysecret"; // dùng process.env.JWT_SECRET trong thực tế

// Giả lập database
const users = [
  { id: 1, username: "admin", password: "123456", role: "admin" },
  { id: 2, username: "employee", password: "123456", role: "employee" },
  { id: 3, username: "client", password: "123456", role: "client" },
];

export async function POST(req) {
  const { username, password } = await req.json();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return new Response(JSON.stringify({ message: "Sai tài khoản hoặc mật khẩu" }), { status: 401 });
  }

  if (user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Bạn không có quyền admin" }), { status: 403 });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET,
    { expiresIn: "1h", algorithm: "HS256" }
  );

  return new Response(JSON.stringify({ token }), { status: 200 });
}