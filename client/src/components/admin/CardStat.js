export default function CardStat({ title, value, color, icon }) {
  return (
    <div className={`p-4 rounded-lg shadow-md bg-white border-l-4 ${color}`}>
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className="text-sm text-gray-500">{title}</h3>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}