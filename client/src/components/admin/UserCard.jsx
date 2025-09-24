export default function UserCard({ name, role, avatar }) {
  return (
    <div className="flex flex-col items-center p-4 border-b border-blue-800">
      <img
        src={avatar || ""}
        alt="Avatar"
        className="w-16 h-16 rounded-full border-2 border-white mb-2"
      />
      <h2 className="text-white font-bold">{name}</h2>
      <p className="text-gray-300 text-sm">{role}</p>
    </div>
  );
}