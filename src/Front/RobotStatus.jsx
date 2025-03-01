import React, { useState, useEffect } from "react";
import axios from "axios";

function RobotStatus() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [robotStatus, setRobotStatus] = useState("พร้อมให้บริการ");
  const [orderDetails, setOrderDetails] = useState(null);
  const [allOrders, setAllOrders] = useState([]);

  // เพิ่มโต๊ะที่ 3
  const tables = ["โต๊ะที่ 1", "โต๊ะที่ 2", "โต๊ะที่ 3"];

  const handleTableSelect = (table) => {
    const tableNumber = parseInt(table.replace("โต๊ะที่ ", ""), 10); // แปลง "โต๊ะที่ 1" → 1
    setSelectedTable(tableNumber);
    setOrderDetails(null);
    setAllOrders([]);
};


  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedTable) return;
  
      try {
          const response = await axios.get(`http://localhost:5000/orders?table=${selectedTable}`);
          console.log("📦 API Response:", response.data);
  
          if (!Array.isArray(response.data)) {
              console.error("❌ API response is not an array:", response.data);
              return;
          }
  
          setAllOrders(response.data);
          setOrderDetails(response.data.length > 0 ? response.data[0] : null);
      } catch (error) {
          console.error("❌ Error fetching order details:", error);
      }
  };
  
  

    if (selectedTable) {
      fetchOrders();
    }
  }, [selectedTable]);

  const handleSendCommand = async () => {
    if (!selectedTable || allOrders.length === 0) {
        alert("❌ ไม่มีออเดอร์ให้ส่ง!");
        return;
    }

    setRobotStatus(`🚀 หุ่นยนต์กำลังนำออเดอร์ไปส่ง...`);

    setTimeout(async () => {
        setRobotStatus(`✅ หุ่นยนต์ส่งออเดอร์เสร็จแล้ว!`);

        try {
            // 🔥 ลบออเดอร์แรกของโต๊ะนั้น
            const firstOrder = allOrders[0];
            await axios.delete(`http://localhost:5000/orders/${firstOrder.id}`);

            // 🔄 โหลดคำสั่งซื้อใหม่ของโต๊ะนั้นจาก Backend
            fetchOrders();
        } catch (error) {
            console.error("❌ Error deleting order:", error);
        }
    }, 3000);
};

  return (
    <div className="p-6 min-h-screen" style={{ 
        background: "linear-gradient(135deg, rgb(215, 190, 255), rgb(230, 245, 255))" 
    }}>
      <h2 className="text-center text-3xl font-bold mb-6" style={{ color: "#4a3d6a" }}>
        🤖 สถานะหุ่นยนต์
      </h2>

      <div className="p-4 rounded-lg shadow-md mb-4 flex items-center justify-between"
        style={{ backgroundColor: "rgb(160, 110, 220)", color: "white", boxShadow: "0px 4px 12px rgba(160, 110, 220, 0.4)" }}>
        <span className="text-lg font-medium">หุ่นยนต์เสิร์ฟอาหาร</span>
        <div className={`w-4 h-4 rounded-full ${robotStatus.includes("🚀") ? "bg-yellow-500" : "bg-green-500"}`}></div>
        <span className="text-2xl">🤖</span>
      </div>

      <p className="text-center text-lg font-medium mb-4" style={{ color: "#4a3d6a" }}>
        🔵 สถานะปัจจุบัน: {robotStatus}
      </p>

      {/* ปุ่มเลือกโต๊ะ */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mb-6">
        {tables.map((table) => (
          <button
            key={table}
            onClick={() => handleTableSelect(table)}
            className="p-4 rounded-lg text-lg font-medium border shadow-md transition"
            style={{
              backgroundColor: selectedTable === table ? "rgb(160, 110, 220)" : "white",
              color: selectedTable === table ? "white" : "#4a3d6a",
              borderColor: "rgb(190, 150, 240)",
              boxShadow: selectedTable === table ? "0px 4px 12px rgba(160, 110, 220, 0.5)" : ""
            }}
          >
            {table}
          </button>
        ))}
      </div>

      {/* คำสั่งซื้อ */}
      {orderDetails && (
        <div className="p-6 rounded-lg mb-6 shadow-lg"
          style={{
            background: "linear-gradient(135deg, rgb(230, 215, 255), rgb(250, 245, 255))",
            boxShadow: "0px 6px 16px rgba(160, 110, 220, 0.3)"
          }}>
          <h3 className="font-bold text-lg mb-4 text-gray-800">📦 คำสั่งซื้อที่ {selectedTable}</h3>

          <div className="p-4 rounded-md shadow-md bg-white">
            <h4 className="font-medium text-lg mb-3 text-purple-700">📌 รายการเมนู</h4>
            
            {orderDetails.items ? (
              JSON.parse(orderDetails.items).map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700 font-medium">{item.name} x {item.quantity}</span>
                  <span className="text-green-600 font-semibold">{(item.price * item.quantity).toFixed(2)} ฿</span>
                </div>
              ))
            ) : (
              <p className="text-red-500 font-medium">❌ ไม่มีเมนูที่สั่ง</p>
            )}

            <div className="mt-3 text-right text-xl font-bold text-green-700">
              💰 รวม: {orderDetails.total_amount?.toFixed(2) || "0.00"} ฿
            </div>
          </div>
        </div>
      )}

      {/* ปุ่มส่งคำสั่งหุ่นยนต์ */}
      <div className="text-center">
        <button
          onClick={handleSendCommand}
          className="px-6 py-3 rounded-lg font-medium transition shadow-md"
          style={{
            backgroundColor: "rgb(160, 110, 220)",
            color: "white",
            boxShadow: "0px 4px 12px rgba(160, 110, 220, 0.5)"
          }}
        >
          🚀 ส่งคำสั่งให้หุ่นยนต์
        </button>
      </div>
    </div>
  );
}

export default RobotStatus;
