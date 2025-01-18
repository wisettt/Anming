import React from "react";

function RobotStatus() {
  // ตัวอย่างข้อมูลหุ่นยนต์
  const robots = [
    { id: 1, name: "หุ่นยนต์หมายเลข 1", status: "red" },
    { id: 2, name: "หุ่นยนต์หมายเลข 2", status: "green" },
    
  ];

  return (
    <div className="p-6">
      <h2 className="text-center text-3xl font-bold mb-6">สถานะหุ่นยนต์</h2>
      <div className="space-y-4">
        {robots.map((robot) => (
          <div
            key={robot.id}
            className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md"
          >
            <span className="text-lg font-medium">{robot.name}</span>
            <div
              className={`w-4 h-4 rounded-full ${
                robot.status === "red" ? "bg-red-500" : "bg-green-500"
              }`}
            ></div>
            <img
              src="https://via.placeholder.com/40"
              alt="Robot"
              className="w-10 h-10"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RobotStatus;
