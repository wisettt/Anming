import React, { useState, useEffect } from "react";
import axios from "axios";

function Menutoay() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filter, setFilter] = useState("all"); 
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 5; 

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/menu", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMenuItems(response.data.data || []);
      } catch (error) {
        console.error("Error fetching menus:", error.response?.data?.message || error.message);
        setMessage("ไม่สามารถโหลดข้อมูลเมนูได้");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const toggleAvailability = async (id) => {
    const token = localStorage.getItem("token");
    const menu = menuItems.find((item) => item.id === id);
    const updatedAvailability = !menu.isAvailable;
  
    try {
      await axios.put(
        `http://localhost:5000/menu/update-menu/${id}`,
        { name: menu.name, price: menu.price, details: menu.details, isAvailable: updatedAvailability },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
  
      setMenuItems(menuItems.map((item) =>
        item.id === id ? { ...item, isAvailable: updatedAvailability } : item
      ));
  
      // 🟢 แสดงข้อความอัปเดต และให้มันหายไปหลังจาก 1 วินาที
      setMessage(`สถานะเมนู "${menu.name}" ถูกอัปเดตเรียบร้อย`);
      setTimeout(() => setMessage(""), 1000); // 1000ms = 1 วินาที
  
    } catch (error) {
      console.error("❌ Error updating availability:", error.response?.data || error.message);
      setMessage("เกิดข้อผิดพลาดในการอัปเดตสถานะเมนู");
      setTimeout(() => setMessage(""), 1000); // กรณีเกิดข้อผิดพลาดก็ให้ข้อความหายไป
    }
  };
  const filteredMenu = menuItems
    .filter((item) => {
      if (filter === "available") return item.isAvailable;
      if (filter === "unavailable") return !item.isAvailable;
      return true;
    })
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  const displayedItems = filteredMenu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-8 min-h-screen" 
      style={{ background: "linear-gradient(135deg, rgb(221, 169, 232), rgb(218, 247, 251))" }}>
      
      <h2 className="text-4xl font-bold text-center mb-6" style={{ color: "rgb(90, 60, 130)" }}>
        🍽️ รายการเมนู
      </h2>

      {message && (
        <div className="p-4 mb-4 rounded-lg shadow-md" 
          style={{ backgroundColor: "rgb(218, 247, 251)", color: "rgb(80, 60, 100)" }}>
          {message}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* ค้นหา */}
        <input
          type="text"
          placeholder="🔍 ค้นหาเมนู..."
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg"
          style={{ backgroundColor: "white", borderColor: "rgb(170, 120, 220)" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* ตัวกรอง */}
        <select
          className="px-4 py-2 border rounded-lg"
          style={{ backgroundColor: "white", borderColor: "rgb(170, 120, 220)" }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">ทั้งหมด</option>
          <option value="available">พร้อมขาย</option>
          <option value="unavailable">ไม่พร้อมขาย</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : (
        <div className="space-y-4">
          {displayedItems.length > 0 ? (
            displayedItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-6 border rounded-lg shadow-md"
                style={{ backgroundColor: "white", borderColor: "rgb(170, 120, 220)" }}
              >
                <div className="flex items-center">
                  {item.image && (
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover mr-4 rounded-lg"
                    />
                  )}
                  <span className={`text-lg font-semibold ${!item.isAvailable ? "text-gray-400" : "text-gray-700"}`}>
                    {item.name}
                  </span>
                  {!item.isAvailable && (
                    <span className="text-red-500 ml-2">(ไม่พร้อมขาย)</span>
                  )}
                </div>

                <span className="text-xl font-bold text-gray-700">{item.price} บาท</span>

                <button
                  onClick={() => toggleAvailability(item.id)}
                  className="py-1 px-4 rounded-lg text-white"
                  style={{ backgroundColor: item.isAvailable ? "rgb(160, 110, 220)" : "rgb(150, 150, 150)" }}
                >
                  {item.isAvailable ? "พร้อมขาย" : "ไม่พร้อมขาย"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">ไม่มีเมนูที่ตรงกับคำค้นหา</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button onClick={() => handlePageChange(currentPage - 1)} 
                className="px-4 py-2 rounded-lg" 
                style={{ backgroundColor: "rgb(218, 247, 251)" }}>
                ก่อนหน้า
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => handlePageChange(i + 1)}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: currentPage === i + 1 ? "rgb(170, 120, 220)" : "rgb(218, 247, 251)", color: currentPage === i + 1 ? "white" : "black" }}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} 
                className="px-4 py-2 rounded-lg" 
                style={{ backgroundColor: "rgb(218, 247, 251)" }}>
                ถัดไป
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Menutoay;
