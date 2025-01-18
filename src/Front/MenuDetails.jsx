import React, { useState, useEffect } from "react";
import axios from "axios";

function MenuDetails() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newMenu, setNewMenu] = useState({ name: "", price: "", details: "", image: null });
  const [showAddForm, setShowAddForm] = useState(false);

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
        setMessage("ไม่สามารถโหลดเมนูได้");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const openMenuDetails = (menu) => {
    setSelectedMenu(menu);
    setImagePreview(menu.image ? `http://localhost:5000${menu.image}` : null);
  };

  const closeMenuDetails = () => {
    setSelectedMenu(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMenu({ ...selectedMenu, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNewMenuImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMenu({ ...newMenu, image: file });
    }
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    if (!newMenu.name || !newMenu.price || !newMenu.details || !newMenu.image) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const formData = new FormData();
    formData.append("name", newMenu.name);
    formData.append("price", newMenu.price);
    formData.append("details", newMenu.details);
    formData.append("image", newMenu.image);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/menu/add-menu", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMenuItems([...menuItems, response.data.data]);
      setMessage("เพิ่มเมนูสำเร็จ");
      setNewMenu({ name: "", price: "", details: "", image: null });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding menu:", error.response?.data?.message || error.message);
      setMessage("เกิดข้อผิดพลาดในการเพิ่มเมนู");
    }
  };

  const handleUpdateMenu = async () => {
    if (!selectedMenu.name || !selectedMenu.price || !selectedMenu.details) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const formData = new FormData();
    formData.append("name", selectedMenu.name);
    formData.append("price", selectedMenu.price);
    formData.append("details", selectedMenu.details);
    if (selectedMenu.image instanceof File) {
      formData.append("image", selectedMenu.image);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/menu/update-menu/${selectedMenu.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMenuItems(
        menuItems.map((item) =>
          item.id === selectedMenu.id
            ? { ...item, ...selectedMenu, image: imagePreview }
            : item
        )
      );

      setMessage("แก้ไขเมนูสำเร็จ");
      closeMenuDetails();
    } catch (error) {
      console.error("Error updating menu:", error.response?.data?.message || error.message);
      setMessage("เกิดข้อผิดพลาดในการแก้ไขเมนู");
    }
  };

  const handleDeleteMenu = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/menu/delete-menu/${selectedMenu.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMenuItems(menuItems.filter((item) => item.id !== selectedMenu.id));
      setMessage("ลบเมนูสำเร็จ");
      closeMenuDetails();
    } catch (error) {
      console.error("Error deleting menu:", error.response?.data?.message || error.message);
      setMessage("เกิดข้อผิดพลาดในการลบเมนู");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-center text-5xl font-bold text-blue-700 mb-8">🍵 เมนูร้านกาแฟ</h2>
      {message && (
        <div className="text-center bg-red-500 text-white p-4 rounded-lg mb-4 shadow-md">
          {message}
        </div>
      )}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mb-4"
      >
        {showAddForm ? "ปิดฟอร์มเพิ่มเมนู" : "เพิ่มเมนูใหม่"}
      </button>
      {showAddForm && (
        <form
          onSubmit={handleAddMenu}
          className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-md mx-auto"
        >
          <h3 className="text-2xl font-bold text-center mb-4">เพิ่มเมนูใหม่</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">ชื่อเมนู</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={newMenu.name}
              onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">ราคา</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={newMenu.price}
              onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">รายละเอียด</label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg"
              rows="4"
              value={newMenu.details}
              onChange={(e) => setNewMenu({ ...newMenu, details: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">อัปโหลดรูปภาพ</label>
            <input type="file" onChange={handleNewMenuImageChange} required />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
          >
            เพิ่มเมนู
          </button>
        </form>
      )}
      {loading ? (
        <p className="text-center text-gray-500 mt-4">กำลังโหลดข้อมูล...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openMenuDetails(item)}
              className="p-6 bg-white shadow-lg rounded-lg text-center cursor-pointer hover:scale-105 transform transition duration-300 hover:shadow-xl"
            >
              {item.image && (
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-gray-700">{item.name}</h3>
              <p className="text-gray-500">{item.details}</p>
              <p className="text-green-600 font-semibold text-lg">{item.price} บาท</p>
            </div>
          ))}
        </div>
      )}
      {/* Selected Menu Details Form */}
      {selectedMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={closeMenuDetails}
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center text-blue-700">📝 แก้ไขเมนู</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">ชื่อเมนู</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                  value={selectedMenu.name}
                  onChange={(e) =>
                    setSelectedMenu({ ...selectedMenu, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">ราคา</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                  value={selectedMenu.price}
                  onChange={(e) =>
                    setSelectedMenu({ ...selectedMenu, price: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">รายละเอียด</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                  rows="4"
                  value={selectedMenu.details}
                  onChange={(e) =>
                    setSelectedMenu({ ...selectedMenu, details: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">เปลี่ยนรูปภาพ</label>
                <input type="file" className="w-full" onChange={handleImageChange} />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-4 w-32 h-32 object-cover rounded-full mx-auto"
                  />
                )}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleUpdateMenu}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  บันทึก
                </button>
                <button
                  type="button"
                  onClick={handleDeleteMenu}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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
