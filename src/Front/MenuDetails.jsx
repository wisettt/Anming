import React, { useState, useEffect } from "react";
import axios from "axios";

function MenuDetails() {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [newMenu, setNewMenu] = useState({
    name: "",
    price: "",
    details: "",
    image: null,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  // ดึงรายการเมนูจาก API เมื่อ component ถูก mount
  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/menu");
      if (res.data && res.data.data) {
        setMenuItems(res.data.data);
      }
    } catch (error) {
      console.error("❌ Error fetching menus:", error);
      setMessage("❌ ไม่สามารถดึงรายการเมนูได้");
    }
  };

  // สำหรับการเพิ่มเมนูใหม่หรือแก้ไขผ่านฟอร์มด้านบน
  const handleAddMenu = async (e) => {
    e.preventDefault();
    if (!newMenu.name || !newMenu.price || !newMenu.details || (!newMenu.image && !editingMenuId)) {
        setMessage("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }

    const formData = new FormData();
    formData.append("name", newMenu.name);
    formData.append("price", newMenu.price);
    formData.append("details", newMenu.details);
    if (newMenu.image) {
        formData.append("image", newMenu.image);
    }

    try {
        const token = localStorage.getItem("token");
        if (editingMenuId) {
            await axios.put(`http://localhost:5000/menu/update-menu/${editingMenuId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage("✅ แก้ไขเมนูสำเร็จ!");
        } else {
            await axios.post("http://localhost:5000/menu/add-menu", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage("✅ เพิ่มเมนูสำเร็จ!");
        }

        // ✅ ตั้งเวลาให้ข้อความหายไปหลังจาก 1.5 วินาที
        setTimeout(() => {
            setMessage("");
        }, 1500);

        setNewMenu({ name: "", price: "", details: "", image: null });
        setImagePreview(null);
        setEditingMenuId(null);
        setShowAddForm(false);
        fetchMenus();
    } catch (error) {
        console.error("❌ Error adding/updating menu:", error);
        setMessage("❌ เกิดข้อผิดพลาดในการเพิ่ม/แก้ไขเมนู");

        // ✅ ตั้งเวลาให้ข้อความหายไปหลังจาก 1.5 วินาที
        setTimeout(() => {
            setMessage("");
        }, 1500);
    }
};

  // เปลี่ยนรูปภาพในฟอร์มด้านบน
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewMenu({ ...newMenu, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  // เปิด modal แก้ไขแยกต่างหาก
  const openMenuDetails = (menu) => {
    setSelectedMenu(menu);
    setImagePreview(menu.image ? `http://localhost:5000${menu.image}` : null);
  };

  // ปิด modal แก้ไข
  const closeMenuDetails = () => {
    setSelectedMenu(null);
    setImagePreview(null);
  };

  // เปลี่ยนรูปภาพใน modal
  const handleModalImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedMenu({ ...selectedMenu, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  // ส่งคำขอแก้ไขเมนูจาก modal
  const handleUpdateMenu = async () => {
    if (!selectedMenu.name || !selectedMenu.price || !selectedMenu.details) {
      setMessage("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const formData = new FormData();
    formData.append("name", selectedMenu.name);
    formData.append("price", selectedMenu.price);
    formData.append("details", selectedMenu.details);
    if (selectedMenu.image && typeof selectedMenu.image !== "string") {
      formData.append("image", selectedMenu.image);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/menu/update-menu/${selectedMenu.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("✅ แก้ไขเมนูสำเร็จ");
      closeMenuDetails();
      fetchMenus();
    } catch (error) {
      console.error("❌ Error updating menu:", error);
      setMessage("❌ เกิดข้อผิดพลาดในการแก้ไขเมนู");
    }
  };

  // ส่งคำขอลบเมนูจาก modal
  const handleDeleteMenu = async () => {
    if (!selectedMenu) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/menu/delete-menu/${selectedMenu.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ ลบเมนูสำเร็จ");
      closeMenuDetails();
      fetchMenus();
    } catch (error) {
      console.error("❌ Error deleting menu:", error);
      setMessage("❌ เกิดข้อผิดพลาดในการลบเมนู");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-200 to-purple-300 min-h-screen">
      <h2 className="text-center text-5xl font-extrabold text-purple-900 mb-8 drop-shadow-lg">
        🍵 เมนูร้านกาแฟ
      </h2>

      {message && (
        <div className="text-center bg-red-500 text-white px-6 py-3 rounded-lg mb-6 shadow-xl">
          {message}
        </div>
      )}

      {/* ฟอร์มเพิ่มเมนูด้านบน */}
      <button
        onClick={() => {
          setShowAddForm(!showAddForm);
          if (!showAddForm) {
            setNewMenu({ name: "", price: "", details: "", image: null });
            setImagePreview(null);
            setEditingMenuId(null);
          }
        }}
        className="bg-green-700 text-white px-8 py-4 rounded-full hover:bg-green-800 mb-8 transition-all duration-300 shadow-2xl"
      >
        {showAddForm ? "ปิดฟอร์ม" : "➕ เพิ่มเมนูใหม่"}
      </button>

      {showAddForm && (
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg mx-auto relative mb-10 animate-fadeIn">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => {
              setShowAddForm(false);
              setEditingMenuId(null);
              setNewMenu({ name: "", price: "", details: "", image: null });
              setImagePreview(null);
            }}
          >
            ✖
          </button>
          <h3 className="text-3xl font-bold text-center text-purple-800 mb-6">
            {editingMenuId ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}
          </h3>
          <form onSubmit={handleAddMenu} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                ชื่อเมนู
              </label>
              <input
                type="text"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="เช่น กาแฟลาเต้"
                value={newMenu.name}
                onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                ราคา (บาท)
              </label>
              <input
                type="number"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="เช่น 50"
                value={newMenu.price}
                onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                รายละเอียด
              </label>
              <textarea
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="เช่น อเมริกาโน่เข้มข้น ไม่ใส่น้ำตาล"
                rows="4"
                value={newMenu.details}
                onChange={(e) => setNewMenu({ ...newMenu, details: e.target.value })}
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                อัปโหลดรูปภาพ
              </label>
              <input type="file" onChange={handleImageChange} required={!editingMenuId} />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-6 w-40 h-40 object-cover rounded-full mx-auto shadow-xl border-4 border-purple-300"
                />
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-purple-700 text-white px-10 py-4 rounded-full hover:bg-purple-800 transition-all duration-300 shadow-2xl"
              >
                {editingMenuId ? "แก้ไขเมนู" : "➕ เพิ่มเมนู"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* แสดงรายการเมนู */}
      <div className="mt-10">
        <h3 className="text-4xl font-bold text-purple-900 mb-8 text-center drop-shadow-md">
          รายการเมนู
        </h3>
        {menuItems.length === 0 ? (
          <p className="text-center text-xl">ไม่มีเมนูในระบบ</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer group"
                onClick={() => openMenuDetails(menu)}
              >
                {/* รูปภาพเมนูแบบวงกลม */}
                <div className="flex justify-center p-4">
                  {menu.image && (
                    <img
                      src={`http://localhost:5000${menu.image}`}
                      alt={menu.name}
                      className="w-32 h-32 object-cover rounded-full border-4 border-purple-300 transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>
                {/* ข้อมูลเมนู */}
                <div className="p-6 text-center">
                  <h4 className="text-2xl font-extrabold text-purple-800 mb-3">
                    {menu.name}
                  </h4>
                  <p className="text-gray-700 text-xl mb-2">
                    ราคา: <span className="font-semibold">{menu.price} บาท</span>
                  </p>
                  <p className="text-gray-600 text-lg line-clamp-2">
                    {menu.details}
                  </p>
                </div>
                {/* ปุ่มดูรายละเอียด */}
                <div className="p-6 pt-0">
                  <button
                    className="w-full bg-purple-700 text-white px-6 py-3 rounded-full hover:bg-purple-800 transition-all duration-300 shadow-lg"
                    onClick={() => openMenuDetails(menu)}
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal สำหรับแก้ไข/ลบเมนู */}
      {selectedMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={closeMenuDetails}
            >
              ✖
            </button>
            <h3 className="text-3xl font-bold text-center text-purple-800 mb-6">
              📝 แก้ไขเมนู
            </h3>
            <form>
              <div className="mb-6">
                <label className="block text-gray-700 text-xl mb-2">
                  ชื่อเมนู
                </label>
                <input
                  type="text"
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={selectedMenu.name}
                  onChange={(e) =>
                    setSelectedMenu({ ...selectedMenu, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-xl mb-2">
                  ราคา
                </label>
                <input
                  type="number"
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={selectedMenu.price}
                  onChange={(e) =>
                    setSelectedMenu({ ...selectedMenu, price: e.target.value })
                  }
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-xl mb-2">
                  รายละเอียด
                </label>
                <textarea
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  rows="4"
                  value={selectedMenu.details}
                  onChange={(e) =>
                    setSelectedMenu({ ...selectedMenu, details: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-xl mb-2">
                  เปลี่ยนรูปภาพ
                </label>
                <input
                  type="file"
                  className="w-full"
                  onChange={handleModalImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-6 w-40 h-40 object-cover rounded-full mx-auto shadow-xl border-4 border-blue-300"
                  />
                )}
              </div>
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleUpdateMenu}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg"
                >
                  บันทึก
                </button>
                <button
                  type="button"
                  onClick={handleDeleteMenu}
                  className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg"
                >
                  ลบเมนู
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuDetails; 